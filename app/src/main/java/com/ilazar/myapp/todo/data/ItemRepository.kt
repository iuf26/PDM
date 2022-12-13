package com.ilazar.myapp.todo.data

import android.app.Application
import android.util.Log
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ilazar.myapp.core.TAG
import com.ilazar.myapp.core.data.remote.Api
import com.ilazar.myapp.todo.data.local.ItemDao
import com.ilazar.myapp.todo.data.remote.ItemEvent
import com.ilazar.myapp.todo.data.remote.ItemService
import com.ilazar.myapp.todo.data.remote.ItemWsClient
import com.ilazar.myapp.util.ConnectivityManagerNetworkMonitor
import com.ilazar.myservices.ui.MyNetworkStatusViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.withContext



class ItemRepository(
    private val itemService: ItemService,
    private val itemWsClient: ItemWsClient,
    private val itemDao: ItemDao,

) {
    val itemStream by lazy { itemDao.getAll() }
    val ofStram by lazy { itemDao.getAllAddedOffline() }

    init {
        Log.d(TAG, "init")

    }
   suspend fun saveOffline(){

            ofStram.collect{items ->
                Log.d("Added offline",items.size.toString())
                for(item in items){
                    val newItem:Item = Item("okId",item.text,item.passengers,item.landed)
                    Log.d("savin off item","sabving off item")
                    itemService.create(item)
                }
            }
       itemDao.deleteOfflineAddedItems()

    }
    suspend fun refresh() {
        Log.d(TAG, "refresh started")
        try {
            val items = itemService.find()
            itemDao.deleteAll()
            items.forEach { itemDao.insert(it) }
            Log.d(TAG, "refresh succeeded")
        } catch (e: Exception) {
            Log.w(TAG, "refresh failed", e)
        }
    }

    suspend fun openWsClient() {
        Log.d(TAG, "openWsClient")
        withContext(Dispatchers.IO) {
            getItemEvents().collect {
                Log.d(TAG, "Item event collected $it")
                if (it.isSuccess) {
                    val itemEvent = it.getOrNull();
                    when (itemEvent?.type) {
                        "created" -> handleItemCreated(itemEvent.payload)
                        "updated" -> handleItemUpdated(itemEvent.payload)
                        "deleted" -> handleItemDeleted(itemEvent.payload)
                    }
                }
            }
        }
    }

    suspend fun closeWsClient() {
        Log.d(TAG, "closeWsClient")
        withContext(Dispatchers.IO) {
            itemWsClient.closeSocket()
        }
    }

    suspend fun getItemEvents(): Flow<Result<ItemEvent>> = callbackFlow {
        Log.d(TAG, "getItemEvents started")
        itemWsClient.openSocket(
            onEvent = {
                Log.d(TAG, "onEvent $it")
                if (it != null) {
                    trySend(Result.success(it))
                }
            },
            onClosed = { close() },
            onFailure = { close() });
        awaitClose { itemWsClient.closeSocket() }
    }

    suspend fun update(item: Item): Item {

        val updatedItem = itemService.update(item._id, item)
        Log.d(TAG, "update $item succeeded")
        handleItemUpdated(updatedItem)
        return updatedItem
    }

    suspend fun updateInLocalStorage(item :Item){
        itemDao.update(item)
    }


    suspend fun save(item: Item,netStat: Boolean): Item {
        Log.d(TAG, "save $item...")
        if(netStat) {
            val createdItem = itemService.create(item)
            Log.d(TAG, "save $item succeeded")

            handleItemCreated(createdItem)
            return createdItem
        }

        val offlineItem:Item = Item("offline",item.text,item.passengers,item.landed)
        Log.d(TAG, "save $offlineItem... offline")
        itemDao.insert(offlineItem)
        Log.d("added offline","added offline items")
        return item;
    }

    private suspend fun handleItemDeleted(item: Item) {
        Log.d(TAG, "handleItemDeleted - todo $item")
    }

    private suspend fun handleItemUpdated(item: Item) {
        Log.d(TAG, "handleItemUpdated...")
        itemDao.update(item)
    }

    public suspend fun handleItemCreated(item: Item) {
        Log.d(TAG, "handleItemCreated...")
        itemDao.insert(item)
    }

    suspend fun deleteAll() {
        itemDao.deleteAll()
    }

    fun setToken(token: String) {
        itemWsClient.authorize(token)
    }
}