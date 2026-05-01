package com.example.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val ChatGPTBlack = Color(0xFF000000)
val ChatGPTDarkGray = Color(0xFF1A1A1A)
val ChatGPTGray = Color(0xFF2D2D2D)
val ChatGPTLightGray = Color(0xFF404040)
val ChatGPTText = Color(0xFFECECF1)
val ChatGPTSecondaryText = Color(0xFF8E8EA0)
val ChatGPTGreen = Color(0xFF19C37D)
val ChatGPTGreenHover = Color(0xFF13A569)

private val DarkColorScheme = darkColorScheme(
    primary = ChatGPTGreen,
    onPrimary = Color.White,
    secondary = ChatGPTGray,
    onSecondary = ChatGPTText,
    background = ChatGPTBlack,
    onBackground = ChatGPTText,
    surface = ChatGPTDarkGray,
    onSurface = ChatGPTText,
    surfaceVariant = ChatGPTGray,
    onSurfaceVariant = ChatGPTSecondaryText,
    outline = ChatGPTLightGray
)

@Composable
fun AppTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = MaterialTheme.typography,
        content = content
    )
}
