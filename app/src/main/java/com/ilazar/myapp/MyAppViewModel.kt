package com.ilazar.myapp

import android.app.Application
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import com.ilazar.myapp.core.TAG
import com.ilazar.myapp.core.data.UserPreferences
import com.ilazar.myapp.core.data.UserPreferencesRepository
import com.ilazar.myapp.todo.data.ItemRepository
import kotlinx.coroutines.launch
import com.ilazar.myapp.util.ConnectivityManagerNetworkMonitor
import androidx.lifecycle.viewmodel.compose.viewModel

class MyAppViewModel(
    private val userPreferencesRepository: UserPreferencesRepository,
    private val itemRepository: ItemRepository
) :
    ViewModel() {

    init {
        Log.d(TAG, "init")

    }


    fun logout() {
        viewModelScope.launch {
            itemRepository.deleteAll()
            userPreferencesRepository.save(UserPreferences())
        }
    }

    fun setToken(token: String) {
        itemRepository.setToken(token)
    }

   companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app =
                    (this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as MyApplication)
                MyAppViewModel(
                    app.container.userPreferencesRepository,
                    app.container.itemRepository
                )


            }
        }
    }
}

