package com.example.app

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.badoo.reaktive.disposable.Disposable
import com.badoo.reaktive.observable.subscribe
import com.example.app.services.PingState
import com.example.app.services.ServiceLocator
import com.example.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun App() {
    AppTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = ChatGPTBlack
        ) {
            PingScreen()
        }
    }
}

@Composable
fun PingScreen() {
    val scope = rememberCoroutineScope()
    var state by remember { mutableStateOf(PingState()) }
    var disposable by remember { mutableStateOf<Disposable?>(null) }

    DisposableEffect(Unit) {
        val d = ServiceLocator.pingService.state.subscribe(
            onNext = { state = it },
            onError = {}
        )
        disposable = d
        onDispose { d.dispose() }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Response area
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {
            if (state.lastResponse.isNotEmpty()) {
                ResponseBubble(response = state.lastResponse)
            } else {
                Text(
                    text = "Send Ping to get Pong",
                    color = ChatGPTSecondaryText,
                    fontSize = 16.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.alpha(0.6f)
                )
            }
        }

        // Input and Button area
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Input field
            OutlinedTextField(
                value = "Ping",
                onValueChange = {},
                readOnly = true,
                singleLine = true,
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = ChatGPTGray,
                    unfocusedContainerColor = ChatGPTGray,
                    disabledContainerColor = ChatGPTGray,
                    focusedBorderColor = ChatGPTLightGray,
                    unfocusedBorderColor = ChatGPTLightGray,
                    focusedTextColor = ChatGPTText,
                    unfocusedTextColor = ChatGPTText
                ),
                modifier = Modifier.fillMaxWidth()
            )

            // Ping Button
            Button(
                onClick = {
                    scope.launch {
                        ServiceLocator.pingService.ping()
                    }
                },
                enabled = !state.isLoading,
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = ChatGPTGreen,
                    disabledContainerColor = ChatGPTLightGray
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
            ) {
                if (state.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = ChatGPTText,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "Ping",
                        color = Color.White,
                        fontSize = 16.sp
                    )
                }
            }

            if (state.error != null) {
                Text(
                    text = "Error: ${state.error}",
                    color = MaterialTheme.colorScheme.error,
                    fontSize = 12.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }
        }
    }
}

@Composable
fun ResponseBubble(response: String) {
    val alpha by animateFloatAsState(targetValue = 1f)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp)
            .alpha(alpha),
        contentAlignment = Alignment.CenterStart
    ) {
        Surface(
            shape = RoundedCornerShape(18.dp, 18.dp, 18.dp, 4.dp),
            color = ChatGPTGray,
            modifier = Modifier.fillMaxWidth(0.85f)
        ) {
            Text(
                text = response,
                color = ChatGPTText,
                fontSize = 16.sp,
                modifier = Modifier.padding(16.dp)
            )
        }
    }
}
