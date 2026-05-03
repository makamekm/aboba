pluginManagement {
    repositories {
        google()
        gradlePluginPortal()
        mavenCentral()
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    }
    plugins {
        kotlin("multiplatform").version("2.0.0")
        kotlin("android").version("2.0.0")
        kotlin("plugin.serialization").version("2.0.0")
        id("com.android.application").version("8.2.0")
        id("com.android.library").version("8.2.0")
        id("org.jetbrains.compose").version("1.6.10")
        id("org.jetbrains.kotlin.plugin.compose").version("2.0.0")
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
    }
}

rootProject.name = "aboba"
include(":shared")
include(":composeApp")
