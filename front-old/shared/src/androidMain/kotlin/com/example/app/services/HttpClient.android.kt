package com.example.app.services

import io.ktor.client.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.client.statement.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

actual class PlatformHttpClient actual constructor() {
    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }

    actual suspend fun postJson(url: String, body: String): String {
        val response = client.post(url) {
            contentType(ContentType.Application.Json)
            setBody(body)
        }
        return response.bodyAsText()
    }
}
