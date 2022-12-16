package com.ilazar.myapp.todo.ui.items

import android.app.Application
import android.util.Log
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Add
import androidx.compose.material.icons.rounded.ThumbUp
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ilazar.myapp.R
import com.ilazar.myapp.util.showSimpleNotification
import com.ilazar.myservices.ui.MyNetworkStatusViewModel

@Composable
fun ItemsScreen(onItemClick: (id: String?) -> Unit, onAddItem: () -> Unit, onLogout: () -> Unit,onCameraOpen : () -> Unit) {
    Log.d("ItemsScreen", "recompose")
    val itemsViewModel = viewModel<ItemsViewModel>(factory = ItemsViewModel.Factory)
    val itemsUiState = itemsViewModel.uiState
    val myNewtworkStatusViewModel = viewModel<MyNetworkStatusViewModel>(
        factory = MyNetworkStatusViewModel.Factory(
            LocalContext.current.applicationContext as Application
        )
    )
    LaunchedEffect(myNewtworkStatusViewModel.uiState){
        Log.d("Iulia see","changed net")
        if(myNewtworkStatusViewModel.uiState){
            itemsViewModel.saveOfflineItems()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Items " + " Is online: ${myNewtworkStatusViewModel.uiState}") },
                actions = {
                    Button(onClick = onLogout) { Text("Logout") }
                    Button(
                        onClick = {
                            Log.d("ItemsScreen", "CAMERA")
                            onCameraOpen()
                        },
                    ) { Icon(Icons.Rounded.ThumbUp, "Camera") }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    Log.d("ItemsScreen", "add")
                    onAddItem()
                },
            ) { Icon(Icons.Rounded.Add, "Add") }

        },

    ) {
        when (itemsUiState) {

            is ItemsUiState.Success ->
                ItemList(itemList = itemsUiState.items, onItemClick = onItemClick)
            is ItemsUiState.Loading -> CircularProgressIndicator()
            is ItemsUiState.Error -> Text(text = "Failed to load items - $it, ${itemsUiState.exception?.message}")
        }
    }
}

@Preview
@Composable
fun PreviewItemsScreen() {
    ItemsScreen(onItemClick = {}, onAddItem = {}, onLogout = {}, onCameraOpen = {})
}
