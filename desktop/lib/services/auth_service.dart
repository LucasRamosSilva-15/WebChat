import 'dart:convert';
import 'dart:io';
import '../models/user_session.dart';

class AuthApiException implements Exception {
  const AuthApiException(this.message, {this.statusCode});

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}

abstract class AuthApiClient {
  Future<AuthResult> login({
    required String apiUrl,
    required String email,
    required String password,
  });

  Future<AuthResult> register({
    required String apiUrl,
    required String name,
    required String email,
    required String password,
  });

  Future<SkyRippleUser> fetchMe({
    required String apiUrl,
    required String token,
  });
}

class HttpAuthApiClient implements AuthApiClient {
  HttpAuthApiClient({HttpClient? httpClient})
      : _externalClient = httpClient;

  final HttpClient? _externalClient;

  @override
  Future<AuthResult> login({
    required String apiUrl,
    required String email,
    required String password,
  }) async {
    final data = await _requestJson(
      method: 'POST',
      url: '${_normalizeBase(apiUrl)}/auth/login',
      body: {
        'email': email.trim(),
        'password': password,
      },
    );
    return _parseAuthResult(data);
  }

  @override
  Future<AuthResult> register({
    required String apiUrl,
    required String name,
    required String email,
    required String password,
  }) async {
    final data = await _requestJson(
      method: 'POST',
      url: '${_normalizeBase(apiUrl)}/auth/register',
      body: {
        'name': name.trim(),
        'email': email.trim(),
        'password': password,
      },
    );
    return _parseAuthResult(data);
  }

  @override
  Future<SkyRippleUser> fetchMe({
    required String apiUrl,
    required String token,
  }) async {
    final data = await _requestJson(
      method: 'GET',
      url: '${_normalizeBase(apiUrl)}/auth/me',
      token: token,
    );
    final rawUser = data['user'] is Map<String, dynamic>
        ? data['user'] as Map<String, dynamic>
        : data;
    return SkyRippleUser.fromJson(rawUser);
  }

  String _normalizeBase(String apiUrl) {
    final trimmed = apiUrl.trim();
    if (trimmed.endsWith('/')) {
      return trimmed.substring(0, trimmed.length - 1);
    }
    return trimmed;
  }

  AuthResult _parseAuthResult(Map<String, dynamic> data) {
    final token = data['token']?.toString() ?? '';
    final userRaw = data['user'];
    if (token.isEmpty || userRaw is! Map<String, dynamic>) {
      throw const AuthApiException('Resposta de autenticação inválida.');
    }
    return AuthResult(
      user: SkyRippleUser.fromJson(userRaw),
      token: token,
    );
  }

  Future<Map<String, dynamic>> _requestJson({
    required String method,
    required String url,
    Map<String, dynamic>? body,
    String? token,
  }) async {
    final client = _externalClient ?? HttpClient();
    client.connectionTimeout = const Duration(seconds: 10);
    try {
      final uri = Uri.parse(url);
      final request = await client.openUrl(method, uri);
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      if (token != null && token.isNotEmpty) {
        request.headers.set(HttpHeaders.authorizationHeader, 'Bearer $token');
      }
      if (body != null) {
        request.add(utf8.encode(jsonEncode(body)));
      }
      final response = await request.close();
      final rawBody = await utf8.decodeStream(response);
      Map<String, dynamic> parsed = {};
      if (rawBody.trim().isNotEmpty) {
        final decoded = jsonDecode(rawBody);
        if (decoded is Map<String, dynamic>) {
          parsed = decoded;
        }
      }
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return parsed;
      }
      final message = parsed['error']?.toString() ??
          parsed['message']?.toString() ??
          'Erro na requisição (${response.statusCode}).';
      throw AuthApiException(message, statusCode: response.statusCode);
    } on AuthApiException {
      rethrow;
    } on SocketException {
      throw const AuthApiException(
        'Não foi possível conectar ao servidor SkyRipple.',
      );
    } on HttpException {
      throw const AuthApiException('Falha de comunicação HTTP.');
    } on FormatException {
      throw const AuthApiException('Resposta inválida do servidor.');
    } finally {
      if (_externalClient == null) {
        client.close();
      }
    }
  }
}
