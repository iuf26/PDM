package com.ilazar.myapp

import android.annotation.SuppressLint
import android.content.ContentValues
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import android.widget.ImageView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.annotation.ContentView
import androidx.annotation.RequiresApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Button
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.core.net.toUri
import androidx.lifecycle.lifecycleScope
import coil.compose.rememberImagePainter
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.ilazar.myapp.camera.CameraCapture
import com.ilazar.myapp.core.TAG
import com.ilazar.myapp.gallery.GallerySelect
import com.ilazar.myapp.ui.theme.MyAppTheme
import com.ilazar.myservices.ui.MyNetworkStatus
import com.squareup.moshi.internal.Util
import kotlinx.coroutines.launch
import java.io.*
import java.util.*

class MainActivity : ComponentActivity() {

    companion object {
        private const val CAMERA_PERMISSION_CODE = 1
        private const val CAMERA = 2
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

  
        setContent {
            Log.d(TAG, "onCreate")

            MyApp {

                MyNetworkStatus()
                MyAppNavHost()
            }
            

        }
    }


    override fun onResume() {
        super.onResume()
        lifecycleScope.launch {
            (application as MyApplication).container.itemRepository.openWsClient()
        }
    }

    override fun onPause() {
        super.onPause()
        lifecycleScope.launch {
            (application as MyApplication).container.itemRepository.closeWsClient()
        }
    }


}

@Composable
fun MyApp(content: @Composable () -> Unit) {

    Log.d("MyApp", "recompose")
    MyAppTheme {

        Surface {

            content()

        }
    }

}

@Preview
@Composable
fun PreviewMyApp() {
    MyApp {

        MyAppNavHost()
    }
}

@RequiresApi(Build.VERSION_CODES.P)
@SuppressLint("SimpleDateFormat")
@OptIn(ExperimentalPermissionsApi::class)
@Composable
fun MainContentCamera(modifier: Modifier = Modifier) {
    var imageUri by remember { mutableStateOf(EMPTY_IMAGE_URI) }
    var context = LocalContext.current;
    var pickedBitmap :Bitmap? = null

    if (imageUri != EMPTY_IMAGE_URI) {
        Box(modifier = modifier) {
            Image(
                modifier = Modifier.fillMaxSize(),
                painter = rememberImagePainter(imageUri),
                contentDescription = "Captured image"
            )
            Button(
                modifier = Modifier.align(Alignment.BottomCenter),
                onClick = {
                    imageUri = EMPTY_IMAGE_URI
                }
            ) {
                Text("Remove image")
            }
        }
    } else {
        var showGallerySelect by remember { mutableStateOf(false) }
        if (showGallerySelect) {
            GallerySelect(
                onImageUri = { uri ->
                    showGallerySelect = false
                    imageUri = uri
                    Log.d("select image",uri.toString())
                    val source = ImageDecoder.createSource(context.contentResolver,imageUri!!)
                    pickedBitmap = ImageDecoder.decodeBitmap(source)
                    Log.d("bitmap",pickedBitmap.toString())


                }
            )
        } else {

            Box(modifier = modifier) {
                CameraCapture(
                    modifier = modifier,
                    onImageFile = { file ->
                        var uri = file.toUri()
                        val filename = "${System.currentTimeMillis()}.jpg"

                        //Output stream

                        try {
                            val parcelFileDescriptor = context.contentResolver.openFileDescriptor(uri, "r")
                            val fileDescriptor: FileDescriptor = parcelFileDescriptor!!.fileDescriptor
                            val image = BitmapFactory.decodeFileDescriptor(fileDescriptor)
                            parcelFileDescriptor.close()
                            val root = Environment.getExternalStorageDirectory().toString()

                            val filename = "${System.currentTimeMillis()}.jpg"

                            //Output stream
                            var fos: OutputStream? = null
                            context?.contentResolver?.also { resolver ->

                                //Content resolver will process the contentvalues
                                val contentValues = ContentValues().apply {

                                    //putting file information in content values
                                    put(MediaStore.MediaColumns.DISPLAY_NAME, filename)
                                    put(MediaStore.MediaColumns.MIME_TYPE, "image/jpg")
                                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_PICTURES)
                                }

                                //Inserting the contentValues to contentResolver and getting the Uri
                                val imageUri: Uri? =
                                    resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)

                                //Opening an outputstream with the Uri that we got
                                fos = imageUri?.let { resolver.openOutputStream(it) }
                            }
                            fos?.use {
                                //Finally writing the bitmap to the output stream that we opened
                                image.compress(Bitmap.CompressFormat.JPEG, 100, it)
                                Log.d("Saved image","image saved in gallery")
                            }



                        } catch (e: IOException) {
                            e.printStackTrace()
                        }
                    }
                )
                Button(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(4.dp),
                    onClick = {
                        showGallerySelect = true
                    }
                ) {
                    Text("Select from Gallery")
                }
            }
        }
    }
}
val EMPTY_IMAGE_URI: Uri = Uri.parse("file://dev/null")