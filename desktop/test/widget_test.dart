import 'package:material_ui/material_ui.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:skyripple_desktop/main.dart';

void main() {
  testWidgets('Auth screen transitions to desktop shell and sends message', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(const SkyRippleApp());

    expect(find.text('Bem-vindo de volta'), findsOneWidget);
    expect(find.text('Entrar no SkyRipple'), findsOneWidget);

    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    expect(find.text('Conversas'), findsOneWidget);
    expect(find.text('Marina Oliveira'), findsWidgets);

    await tester.tap(find.text('Salas').first);
    await tester.pumpAndSettle();

    expect(find.text('# Tecnologia & Flutter'), findsWidgets);
    expect(find.text('Dono'), findsWidgets);
  });
}
