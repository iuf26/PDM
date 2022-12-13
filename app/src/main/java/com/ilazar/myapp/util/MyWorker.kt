package com.ilazar.myapp.util
import android.content.Context
import android.util.Log
import androidx.lifecycle.ViewModelProvider
import androidx.work.CoroutineWorker
import androidx.work.Worker
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import com.ilazar.myapp.MyApplication
import com.ilazar.myapp.core.data.remote.Api
import com.ilazar.myapp.todo.data.Item
import com.ilazar.myapp.todo.data.ItemRepository
import com.ilazar.myapp.todo.data.remote.ItemService
import com.ilazar.myapp.todo.ui.item.ItemViewModel
import java.util.concurrent.TimeUnit.SECONDS

class MyWorker(
    context: Context,
    private val workerParams: WorkerParameters,
) : CoroutineWorker(context, workerParams) {
    override suspend fun doWork(): Result { // perform long running operaon
        var s = 0
        val action = workerParams.inputData.getString("action").toString();
        val id = workerParams.inputData.getString("id").toString();
        val text = workerParams.inputData.getString("text").toString()
        val passengers = workerParams.inputData.getInt("passengers",0)
       // itemRepository.update(Item(id, text, passengers,false))
        val itemService:ItemService = Api.retrofit.create(ItemService::class.java);

        if(action == "update"){
        itemService.update(id,Item(id, text, passengers,false))
        }else{
            if(action == "add"){
                itemService.create(Item(id, text, passengers,false))
            }
        }

        Log.d("MyWorker", "Updated item")
        return Result.success(workDataOf("result" to s))
    }
}