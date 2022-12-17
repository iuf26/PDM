package com.ilazar.myapp.todo.ui

import android.app.Application
import android.content.Intent
import android.graphics.ColorSpace
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.ThumbUp
import androidx.compose.material.icons.sharp.Add
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.ImageBitmapConfig
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.colorspace.ColorSpaces
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.ilazar.myapp.R
import com.ilazar.myapp.camera.ShowPhoto
import com.ilazar.myapp.gallery.GallerySelect
import com.ilazar.myapp.todo.ui.item.ItemViewModel
import com.ilazar.myapp.util.createNotificationChannel
import com.ilazar.myapp.util.showSimpleNotification
import com.ilazar.myservices.ui.MyNetworkStatusViewModel


@ExperimentalPermissionsApi
@RequiresApi(Build.VERSION_CODES.P)
@Composable
fun ItemScreen(itemId: String?, onClose: () -> Unit, onCameraOpen: () -> Unit) {
    val itemViewModel = viewModel<ItemViewModel>(factory = ItemViewModel.Factory(itemId))
    val itemUiState = itemViewModel.uiState
    var text by rememberSaveable { mutableStateOf(itemUiState.item?.text ?: "") }
    var passangers by rememberSaveable { mutableStateOf(itemUiState.item ?.passengers?.toString()) }
    var photo by rememberSaveable { mutableStateOf(itemUiState.item?.photo) }
    val myNewtworkStatusViewModel = viewModel<MyNetworkStatusViewModel>(
        factory = MyNetworkStatusViewModel.Factory(
            LocalContext.current.applicationContext as Application
        )
    )
    val context = LocalContext.current
    val urin = Uri.parse("content://com.android.providers.media.documents/document/image%3A36")
    var source by remember{ mutableStateOf( ImageDecoder.createSource(context.contentResolver,urin!!))}

   // var cpco = ImageDecoder.decodeBitmap(source).asImageBitmap()
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

    var showGallerySelect by remember { mutableStateOf(false) }

    var showImage by remember { mutableStateOf(false) }
    var  myBitmap: ImageBitmap by remember { mutableStateOf(ImageBitmap(1,1, ImageBitmapConfig.Argb8888,true,
        ColorSpaces.Srgb)) }
    var imgUri by remember { mutableStateOf(Uri.parse("content://com.android.providers.media.documents/document/image%3A36")) }
    if (showGallerySelect) {

        GallerySelect(
            onImageUri = { uri ->
                showGallerySelect = false

                //Log.d("select image",uri.toString())
                imgUri = uri
                photo  = uri.toString()
                 source = ImageDecoder.createSource(context.contentResolver,uri!!)
              myBitmap = ImageDecoder.decodeBitmap(source).asImageBitmap()
//                Log.d("bitmap",myBitmap.toString())
                showImage = true;


            }
        )


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
                            if(photo != null){
                        itemViewModel.saveOrUpdateItem2(text,Integer.parseInt(passangers),myNewtworkStatusViewModel.uiState,
                            photo!!
                        )}
                    }) { Text("Save") }
                    Button(
                        onClick = {
                            Log.d("ItemsScreen", "CAMERA")
                            //onCameraOpen()
                            showGallerySelect = true;
                        },
                    ) { Icon(Icons.Rounded.ThumbUp, "Gallery") }
                    Button(
                        onClick = {
                            Log.d("ItemsScreen", "CAMERA")
                            onCameraOpen()
                           // showGallerySelect = true;
                        },
                    ) { Icon(Icons.Sharp.Add, "Camera") }
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
                value = passangers.toString(),
                onValueChange = { passangers = it },
                label = { Text("Passangers") },

            )
            if(photo != null)
            TextField(value = photo!!, onValueChange = {})
            if(showImage) {
                println("hallpi")
                println(myBitmap.toString())
                println("done")

                Image(bitmap = myBitmap, contentDescription ="img" )
            }




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



@OptIn(ExperimentalPermissionsApi::class)
@RequiresApi(Build.VERSION_CODES.P)
@Preview
@Composable
fun PreviewItemScreen() {
    ItemScreen(itemId = "0", onClose = {}, onCameraOpen = {})
}
