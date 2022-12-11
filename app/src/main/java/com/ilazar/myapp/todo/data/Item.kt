package com.ilazar.myapp.todo.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate
import java.util.Date

@Entity(tableName = "items")
data class  Item(@PrimaryKey val _id: String = "", val text: String = "",val passengers:Int=1,val landed:Boolean = false)
//data class  Item(@PrimaryKey val _id: String = "", val text: String = "",val passengers: String = "")
