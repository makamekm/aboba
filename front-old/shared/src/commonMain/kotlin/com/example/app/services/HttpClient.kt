package com.example.app.services

import kotlinx.serialization.json.Json

expect class PlatformHttpClient() {
    suspend fun postJson(url: String, body: String): String
}

fun createHttpClient(): PlatformHttpClient = PlatformHttpClient()
