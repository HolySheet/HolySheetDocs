### List files

Lists HolySheet generated files.

```endpoint
GET /list
```

#### Example request

```curl
$ curl https://api.holysheet.org/list?{path}&{starred}&{trashed} -H 'Authentication: xyz'
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
    "sheets": 6,
    "size": "59663369",
    "date": "1580423863739",
    "selfOwned": true,
    "owner": "Adam Yarris",
    "driveLink": "https://drive.google.com/drive/folders/16dHIeHW82BYgBgfMlp3SQ8D1rhRmRO0F",
    "starred": true
  }
]
```

**Response**

| Property    | Description                                                  |
| ----------- | ------------------------------------------------------------ |
| `name`      | The name of the file                                         |
| `id`        | The drive ID of the containing folder of the sheets          |
| `sheets`    | The number of sheets making up the file                      |
| `size`      | The size in bytes of all encoded data uploaded to sheets     |
| `date`      | The date in milliseconds the file was created                |
| `selfOwned` | If the file is owned by the user or shared                   |
| `owner`     | The file owner's name                                        |
| `driveLink` | A direct Google Drive link to the top-level folder containing the sheets |
| `starred`   | If the file is starred                                       |



### Upload

Uploads an arbitrary file to HolySheet.

```endpoint
POST /upload
```

#### Example request

```curl
$ curl -F 'data=@/home/RubbaBoy/input.png' https://api.holysheet.org/upload -H 'Authentication: xyz'
```

#### Response

```json
{
    "message": "Received successfully",
    "processingToken": "bcf857c0-dff9-4764-85db-2baceb657a32"
}
```

**Response**

| Property          | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `message`         | The response message                                         |
| `processingToken` | An untrimmed UUID token that may be used to connect with a websocket to get processing statuses |




### Processing Status

Lists HolySheet generated files.

```endpoint
GET /websocket
```

#### Example request

```curl
ws://api.holysheet.org/websocket?{processingToken}
```

#### Example response

```json
0.85
```

**Response**

The response comes in the form of a stream of number strings from 0-1, representing the percentage of completion the processing is at. The websocket will be closed 
