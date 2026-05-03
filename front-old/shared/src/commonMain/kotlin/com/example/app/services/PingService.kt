package com.example.app.services

import com.badoo.reaktive.observable.Observable
import com.badoo.reaktive.subject.behavior.BehaviorSubject
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

@Serializable
data class PingRequest(val message: String)

@Serializable
data class PingResponse(val response: String)

interface PingService : AsyncInit {
    val state: Observable<PingState>
    suspend fun ping()
}

data class PingState(
    val lastResponse: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

class PingServiceImpl(
    private val baseUrl: String = "http://localhost:3000"
) : PingService {

    private val _state: BehaviorSubject<PingState> = BehaviorSubject(PingState())
    override val state: Observable<PingState> = _state

    private val httpClient = createHttpClient()
    private val json = Json { ignoreUnknownKeys = true }

    override suspend fun init() {
        _state.onNext(PingState())
    }

    override suspend fun ping() {
        _state.onNext(_state.value.copy(isLoading = true, error = null))
        try {
            val body = json.encodeToString(PingRequest.serializer(), PingRequest(message = "Ping"))
            val responseText = httpClient.postJson("$baseUrl/api/ping", body)
            val response = json.decodeFromString(PingResponse.serializer(), responseText)
            _state.onNext(_state.value.copy(lastResponse = response.response, isLoading = false))
        } catch (e: Exception) {
            _state.onNext(_state.value.copy(error = e.message, isLoading = false))
        }
    }
}

object ServiceLocator {
    val pingService: PingService by lazy { PingServiceImpl() }
}
