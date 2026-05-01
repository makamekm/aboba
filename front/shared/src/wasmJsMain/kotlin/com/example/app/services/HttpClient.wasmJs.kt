package com.example.app.services

import kotlinx.browser.window
import kotlinx.coroutines.await
import org.w3c.fetch.RequestInit
import org.w3c.fetch.Headers
import kotlin.js.JsAny
import kotlin.js.JsString
import kotlin.js.Promise
import kotlin.js.toJsString

actual class PlatformHttpClient actual constructor() {
    actual suspend fun postJson(url: String, body: String): String {
        val headers = Headers()
        headers.append("Content-Type", "application/json")

        val response = window.fetch(
            url,
            RequestInit(method = "POST", headers = headers, body = body.toJsString())
        ).await<FetchResponse>()

        return response.text().await<JsString>().toString()
    }
}

@Suppress("UNCHECKED_CAST_TO_EXTERNAL_INTERFACE")
private external interface FetchResponse : JsAny {
    fun text(): Promise<JsString>
}
