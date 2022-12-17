package com.ilazar.myapp.camera



import android.graphics.ImageDecoder
import android.media.Image
import android.net.Uri
import android.os.Build
import android.view.ViewGroup
import androidx.annotation.RequiresApi
import androidx.annotation.RequiresPermission
import androidx.camera.core.Preview
import androidx.camera.core.UseCase
import androidx.camera.view.PreviewView
import androidx.compose.foundation.Image
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.viewinterop.AndroidView
import com.google.accompanist.permissions.ExperimentalPermissionsApi

@Composable
fun CameraPreview(
    modifier: Modifier = Modifier,
    scaleType: PreviewView.ScaleType = PreviewView.ScaleType.FILL_CENTER,
    onUseCase: (UseCase) -> Unit = { }
) {
    AndroidView(
        modifier = modifier,
        factory = { context ->
            val previewView = PreviewView(context).apply {
                this.scaleType = scaleType
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
            onUseCase(
                Preview.Builder()
                    .build()
                    .also {
                        it.setSurfaceProvider(previewView.surfaceProvider)
                    }
            )
            previewView
        }
    )
}

@Composable
fun ShowPhoto(
    source: ImageBitmap?
){
    print("sourcei" + source?.toString())
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P && source != null) {
        androidx.compose.foundation.Image(bitmap = source, contentDescription = "img")
    }
}