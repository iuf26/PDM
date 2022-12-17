package com.ilazar.myapp.todo.ui.item

import android.app.Application
import android.content.Intent
import android.provider.MediaStore
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import androidx.work.*
import com.ilazar.myapp.MyApplication
import com.ilazar.myapp.core.TAG
import com.ilazar.myapp.todo.data.Item
import com.ilazar.myapp.todo.data.ItemRepository
import com.ilazar.myapp.util.MyWorker
import com.ilazar.myapp.util.showSimpleNotification
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit

data class ItemUiState(
    val isLoading: Boolean = false,
    val loadingError: Throwable? = null,
    val itemId: String? = null,
    val item: Item? = null,
    val isSaving: Boolean = false,
    val savingCompleted: Boolean = false,
    val savingError: Throwable? = null,
)

class ItemViewModel(private val itemId: String?, private val itemRepository: ItemRepository,private val application:Application) :
    ViewModel() {
    private var workManager: WorkManager = WorkManager.getInstance(application)
    var uiState: ItemUiState by mutableStateOf(ItemUiState(isLoading = true))
        private set




    init {

        Log.d(TAG, "init")
        if (itemId != null) {
            loadItem()
        } else {
            uiState = uiState.copy(item = Item(), isLoading = false)
        }
    }

    fun loadItem() {
        viewModelScope.launch {
            itemRepository.itemStream.collect { items ->
                if (!uiState.isLoading) {
                    return@collect
                }
                val item = items.find { it._id == itemId }
                uiState = uiState.copy(item = item, isLoading = false)
            }
        }
    }

    fun onImageToTake(){
        val takePhotoIntent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
        application.startActivity(takePhotoIntent);
    }
    fun saveOrUpdateItem2(text: String,passengers:Int,netStat: Boolean,photo:String){
        viewModelScope.launch {
            Log.d(TAG, "saveOrUpdateItem...");
            try {
                uiState = uiState.copy(isSaving = true, savingError = null)
                val item = uiState.item?.copy(text = text, passengers = passengers)
                if (itemId == null) {
                    val constraints = Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build()
                    val inputData = Data.Builder().putString("action","add")
                        .putString("id", item?._id)
                        .putString("text",text)
                        .putInt("passengers",passengers)
                        .build()
                    val myWork = OneTimeWorkRequest.Builder(MyWorker::class.java)
                        .setConstraints(constraints)
                        .setInputData(inputData)
                        .build()

                    workManager.apply {
                        enqueue(myWork)
                    }
                    if (item != null) {
                        itemRepository.handleItemCreated(item)
                    }
                } else {

                    val constraints = Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build()
                    val inputData = Data.Builder().putString("action","update")
                        .putString("id", item?._id)
                        .putString("text",text)
                        .putInt("passengers",passengers)
                        .putString("photo",photo)
                        .build()
                    val myWork = OneTimeWorkRequest.Builder(MyWorker::class.java)
                        .setConstraints(constraints)
                        .setInputData(inputData)
                        .build()


                    workManager.apply {
                        enqueue(myWork)
                    }

                    Log.d(TAG, "worker should work");
                    //  itemRepository.update(item!!)
                    if (item != null) {
                        itemRepository.updateInLocalStorage(item)
                    }
                }
                Log.d(TAG, "saveOrUpdateItem succeeded");
                uiState = uiState.copy(isSaving = false, savingCompleted = true)
            } catch (e: Exception) {
                Log.d(TAG, "saveOrUpdateItem failed");

                uiState = uiState.copy(isSaving = false, savingError = e)
            }
        }
    }
    fun saveOrUpdateItem(text: String,passengers:Int,netStat: Boolean) {
        Log.d("Iulia see",passengers.toString())
        viewModelScope.launch {
            Log.d(TAG, "saveOrUpdateItem...");
            try {
                uiState = uiState.copy(isSaving = true, savingError = null)
                val item = uiState.item?.copy(text = text, passengers = passengers)
                if (itemId == null) {
                    val constraints = Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build()
                    val inputData = Data.Builder().putString("action","add")
                        .putString("id", item?._id)
                        .putString("text",text)
                        .putInt("passengers",passengers)
                        .build()
                    val myWork = OneTimeWorkRequest.Builder(MyWorker::class.java)
                        .setConstraints(constraints)
                        .setInputData(inputData)
                        .build()

                    workManager.apply {
                        enqueue(myWork)
                    }
                    if (item != null) {
                        itemRepository.handleItemCreated(item)
                    }
                } else {

                    val constraints = Constraints.Builder()
                        .setRequiredNetworkType(NetworkType.CONNECTED)
                        .build()
                    val inputData = Data.Builder().putString("action","update")
                        .putString("id", item?._id)
                        .putString("text",text)
                        .putInt("passengers",passengers)
                        .build()
                    val myWork = OneTimeWorkRequest.Builder(MyWorker::class.java)
                        .setConstraints(constraints)
                        .setInputData(inputData)
                        .build()


                    workManager.apply {
                        enqueue(myWork)
                    }

                    Log.d(TAG, "worker should work");
                  //  itemRepository.update(item!!)
                    if (item != null) {
                        itemRepository.updateInLocalStorage(item)
                    }
                }
                Log.d(TAG, "saveOrUpdateItem succeeded");
                uiState = uiState.copy(isSaving = false, savingCompleted = true)
            } catch (e: Exception) {
                Log.d(TAG, "saveOrUpdateItem failed");

                uiState = uiState.copy(isSaving = false, savingError = e)
            }
        }
    }

    companion object {
        fun Factory(itemId: String?): ViewModelProvider.Factory = viewModelFactory {
            initializer {
                val app =
                    (this[ViewModelProvider.AndroidViewModelFactory.APPLICATION_KEY] as MyApplication)

                ItemViewModel(itemId, app.container.itemRepository,app)
            }
        }
    }
}

