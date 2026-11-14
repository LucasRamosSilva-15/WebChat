pragma Singleton

import QtQuick

QtObject {
    id: root

    property var entries: []
    property int currentIndex: -1

    readonly property bool canGoBack: currentIndex > 0
    readonly property bool canGoForward: currentIndex >= 0 && currentIndex < entries.length - 1

    signal navigateRequested(string route, var props)

    function sameEntry(a, b) {
        if (!a || !b) {
            return false
        }
        if (a.route !== b.route) {
            return false
        }
        const roomA = a.props && a.props.roomId ? String(a.props.roomId) : ""
        const roomB = b.props && b.props.roomId ? String(b.props.roomId) : ""
        return roomA === roomB
    }

    function initIfEmpty(route, props) {
        if (entries.length === 0) {
            const p = props || {}
            entries = [{ "route": route, "props": p }]
            currentIndex = 0
        }
    }

    function reset(route, props) {
        const p = props || {}
        entries = [{ "route": route, "props": p }]
        currentIndex = 0
        navigateRequested(route, p)
    }

    function push(route, props) {
        const p = props || {}
        const nextEntry = { "route": route, "props": p }
        if (currentIndex >= 0 && currentIndex < entries.length && sameEntry(entries[currentIndex], nextEntry)) {
            return
        }
        const sliced = currentIndex >= 0 ? entries.slice(0, currentIndex + 1) : []
        sliced.push(nextEntry)
        entries = sliced
        currentIndex = entries.length - 1
        navigateRequested(route, p)
    }

    function goBack() {
        if (!canGoBack) {
            return
        }
        currentIndex -= 1
        const entry = entries[currentIndex]
        navigateRequested(entry.route, entry.props || {})
    }

    function goForward() {
        if (!canGoForward) {
            return
        }
        currentIndex += 1
        const entry = entries[currentIndex]
        navigateRequested(entry.route, entry.props || {})
    }
}
