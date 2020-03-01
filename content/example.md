### List files

Lists HolySheet generated files.

```endpoint
GET /list
```

#### Example request

```curl
$ curl https://api.holysheet.net/list?path=subdir&starred=false&trashed=false -H 'Authentication: xyz'
```

**Request**

| Property  | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `path`    | (optional) The path to list files from relative from the `sheetStore` folder |
| `starred` | (optional) Boolean value to only list starred files. Defaults to `false` |
| `trashed` | (optional) Boolean value to only list trashed files. Defaults to `false` |



#### Response

```json
[
  {
    "name": "bob.mp4",
    "id": "16dHIeHW82BYgBgfMlp3SQ8D1rhRmRO0F",
    "path": "/",
    "sheets": 6,
    "size": "59663369",
    "date": "1580423863739",
    "selfOwned": true,
    "owner": "Adam Yarris",
    "driveLink": "https://drive.google.com/drive/folders/16dHIeHW82BYgBgfMlp3SQ8D1rhRmRO0F",
    "starred": true,
    "trashed": false
  }
]
```

**Response**

| Property    | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `name`      | The name of the file                                         |
| `id`        | The drive ID of the containing folder of the sheets          |
| `path`      | The path of the file in HolySheet                            |
| `sheets`    | The number of sheets making up the file                      |
| `size`      | The size in bytes of all encoded data uploaded to sheets     |
| `date`      | The date in milliseconds the file was created                |
| `selfOwned` | If the file is owned by the user or shared                   |
| `owner`     | The file owner's name                                        |
| `driveLink` | A direct Google Drive link to the top-level folder containing the sheets |
| `starred`   | If the file is starred                                       |
| `trashed`   | If the file is currently in the trash                        |

### Upload

Uploads an arbitrary file to HolySheet.

```endpoint
WS /upload?{Authentication}&{name}&{length}&{path}
```

#### Example request

```curl
$ curl -F 'data=@/home/RubbaBoy/input.png' https://api.holysheet.org/upload?Authentication=xyz&name=input.png&length=123456&path=/
```

**Request**

| Property         | Description                                                  |
| ---------------- | ------------------------------------------------------------ |
| `Authentication` | The authentication token, instead of as a header             |
| `name`           | The name of the file being uploaded                          |
| `length`         | The length in bytes of the file being uploaded               |
| `path`           | The path to list files from relative from the `sheetStore` folder |

#### Response

```json
{
    "status": "ok",
    "progress": 82
}
```

#### Response (1000 Normal)

```json
{
    "status": "done",
    "progress": 100
}
```

#### Response (1009 Too Large)

```json
{
    "status": "Maximum payload size is 4000000 bytes",
    "progress": 0
}
```

#### Response (1011 Server Error)

```json
{
    "status": "An internal error occurred",
    "progress": 0
}
```



**Response**

| Property   | Description                                                  |
| ---------- | ------------------------------------------------------------ |
| `status`   | The status of the previous chunk upload. Standard responses will be `"ok"` |
| `progress` | The 0-100 percentage of completion                           |

Whenever a `status` of `"ok"` is sent to the server, raw binary data of the file being uploaded must be sent. The upload will not succeed if data is sent otherwise. The most data sent per chunk is 4MB. Anything more will close with a 1009.

**Response Codes**

These are close reason codes. The standard response on the right will be the reason for the close.

| Property | Description                                                  |
| -------- | ------------------------------------------------------------ |
| 1000     | A successful file upload, happens when the uploaded length meets the length given in the request. Status will always be `"done"` |
| 1009     | The sent data is too large (Over 4MB)                        |
| 1011     | An internal server error has occurred. Site administrators should look in the server logs for any stacktraces. The upload of the file is not guaranteed, it should be expected to have failed. |

### Download

Downloads a given file by its ID.

```endpoint
GET /download?{Authentication}&{id}
```

#### Example request

```curl
$ curl https://api.holysheet.net/download?Authentication=xyz&id=abc -o file.png
```

**Request**

| Property         | Description                                      |
| ---------------- | ------------------------------------------------ |
| `Authentication` | The authentication token, instead of as a header |
| `id`             | The drive ID of the file to download             |



#### Response

```json
Byte stream
```

**Response**

| Property | Description                                                  |
| -------- | ------------------------------------------------------------ |
| `N/A`    | The raw byte stream of the file will be sent over as a response |

Timeout on this request must be high, as it may take some time to process the file.

### Delete

Sends a given file ID into the standard Google Drive trash. If it is already trashed or the `permanent` query is `true`, it will be permanently deleted.

```endpoint
GET /delete?{id}&{permanent}
```

#### Example request

```curl
$ curl https://api.holysheet.net/delete?id=abc&permanent=false -H 'Authentication: xyz'
```

**Request**

| Property    | Description                                            |
| ----------- | ------------------------------------------------------ |
| `id`        | The drive ID of the file to delete                     |
| `permanent` | (optional) If the deletion should skip the trash phase |



#### Response

```json
{
    "message": "Deleted successfully"
}
```

**Response**

| Property  | Description          |
| --------- | -------------------- |
| `message` | The response message |

### Restore

Restores a trashed file with the given drive ID.

```endpoint
GET /restore?{id}
```

#### Example request

```curl
$ curl https://api.holysheet.net/restore?id=abc -H 'Authentication: xyz'
```

**Request**

| Property | Description                         |
| -------- | ----------------------------------- |
| `id`     | The drive ID of the file to restore |



#### Response

```json
{
    "message": "Restored successfully"
}
```

**Response**

| Property  | Description          |
| --------- | -------------------- |
| `message` | The response message |

### Star

Stars (or unstars) a given file.

```endpoint
GET /star?{id}&{starred}
```

#### Example request

```curl
$ curl https://api.holysheet.net/star?id=abc&starred=true -H 'Authentication: xyz'
```

**Request**

| Property  | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `id`      | The drive ID of the file to restore                          |
| `starred` | A boolean value representing if a file should be starred (true) or unstarred (false). |



#### Response

```json
{
    "message": "Starred successfully"
}
```

**Response**

| Property  | Description          |
| --------- | -------------------- |
| `message` | The response message |

### Move

Moves a given file to a path. This does not move the file in Google Drive, it adds a property saying where the file is, requiring all file moving in HolySheet to be done through the API.

```endpoint
GET /move?{id}&{path}
```

#### Example request

```curl
$ curl https://api.holysheet.net/move?id=abc&path=/test/ -H 'Authentication: xyz'
```

**Request**

| Property  | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `id`      | The drive ID of the file to restore                          |
| `path` | The path to move the file to relative from the `sheetStore` folder |



#### Response

```json
{
    "message": "Moved successfully"
}
```

**Response**

| Property  | Description          |
| --------- | -------------------- |
| `message` | The response message |

### Create Folder

Creates an empty folder. These folders are not actual folders in Google Drive, they are simply some JSON data in the root `sheetStore` folder.

```endpoint
GET /createfolder?{path}
```

#### Example request

```curl
$ curl https://api.holysheet.net/createfolder?path=/test/ -H 'Authentication: xyz'
```

**Request**

| Property  | Description                                                  |
| --------- | ------------------------------------------------------------ |
| `path` | The path relative from the `sheetStore` folder to create |



#### Response

```json
{
    "message": "Created successfully"
}
```

**Response**

| Property  | Description          |
| --------- | -------------------- |
| `message` | The response message |
