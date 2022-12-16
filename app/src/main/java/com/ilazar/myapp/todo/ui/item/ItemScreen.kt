package com.ilazar.myapp.todo.ui

import android.app.Application
import android.content.Intent
import android.provider.MediaStore
import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ilazar.myapp.R
import com.ilazar.myapp.todo.ui.item.ItemViewModel
import com.ilazar.myapp.util.createNotificationChannel
import com.ilazar.myapp.util.showSimpleNotification
import com.ilazar.myservices.ui.MyNetworkStatusViewModel

@Composable
fun ItemScreen(itemId: String?, onClose: () -> Unit) {
    val itemViewModel = viewModel<ItemViewModel>(factory = ItemViewModel.Factory(itemId))
    val itemUiState = itemViewModel.uiState
    var text by rememberSaveable { mutableStateOf(itemUiState.item?.text ?: "") }
    var passangers by rememberSaveable { mutableStateOf(itemUiState.item ?.passengers.toString()) }
    val myNewtworkStatusViewModel = viewModel<MyNetworkStatusViewModel>(
        factory = MyNetworkStatusViewModel.Factory(
            LocalContext.current.applicationContext as Application
        )
    )
    val context = LocalContext.current

//    var passengers by rememberSaveable { mutableStateOf(itemUiState.item?.passengers?.toString(): "") }
//    Log.d("ItemScreen", "recompose, text = $text")

    LaunchedEffect(itemUiState.savingCompleted) {
        Log.d("ItemScreen", "Saving completed = ${itemUiState.savingCompleted}");
        if (itemUiState.savingCompleted) {
            onClose();
        }
    }

    var textInitialized by remember { mutableStateOf(itemId == null) }
    LaunchedEffect(itemId, itemUiState.isLoading) {
        Log.d("ItemScreen", "Saving completed = ${itemUiState.savingCompleted}");
        if (textInitialized) {
            return@LaunchedEffect
        }
        if (itemUiState.item != null && !itemUiState.isLoading) {
            text = itemUiState.item.text
            textInitialized = true
        }
    }


    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(id = R.string.item)) },
                actions = {
                    Button(onClick = {
                        Log.d("ItemScreen", "save item text = $text");

                        if(!myNewtworkStatusViewModel.uiState){
                            createNotificationChannel("offlineMode",context)
                            Log.d("Iulia see","sendind notif for offline")
                            showSimpleNotification(
                                context,
                                "offlineMode",
                                0,
                                "Saving data offline notification",
                                "All your modifications are happening offline mode"
                            )
                        }
                        itemViewModel.saveOrUpdateItem(text,Integer.parseInt(passangers),myNewtworkStatusViewModel.uiState)
                    }) { Text("Save") }
                }
            )
        }
    ) {
        if (itemUiState.isLoading) {
            CircularProgressIndicator()
            return@Scaffold
        }
        if (itemUiState.loadingError != null) {
            Text(text = "Failed to load item - ${itemUiState.loadingError.message}")
        }
        Column {
            TextField(
                value = text,
                onValueChange = { text = it }, label = { Text("Plane code") },

            )
            TextField(
                value = passangers,
                onValueChange = { passangers = it },
                label = { Text("Passangers") },

            )

        }



        if (itemUiState.isSaving) {
            Column(
                Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) { LinearProgressIndicator() }
        }
        if (itemUiState.savingError != null) {
            Text(text = "Failed to save item - ${itemUiState.savingError.message}")
        }
    }
}


@Preview
@Composable
fun PreviewItemScreen() {
    ItemScreen(itemId = "0", onClose = {})
}
