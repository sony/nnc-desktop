/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

const MAX_MULTI_UPLOAD_PART: number = 10000; // マルチアップロードの分割のmax数

export class S3Util {

  public static async uploadMultiPart(
    s3: AWS.S3,
    s3Params: AWS.S3.Types.CreateMultipartUploadRequest,
    file: File,
    onPartUpload: (progress: number) => void,
    successCallback: () => void,
    errorCallback: () => void,
    suspendCallback?: () => void,
    checkIsSuspend?: () => boolean
  ) {
    const fileSize: number = file.size;

    let partSize: number = 5 * 1024 * 1024; // 5MB

    while (fileSize / partSize > MAX_MULTI_UPLOAD_PART) { // Uploadの分割回数は10000までのため、サイズが大きい場合はpartSizeを調整する
      partSize = partSize * 2;
    }

    const multipartMap: { Parts: AWS.S3.Types.CompletedPartList } = {
      Parts: [] as AWS.S3.Types.CompletedPartList
    };

    let uploadId: string = '';
    const {ContentType , ...otherParams} = s3Params;
    let failed: boolean = false;
    let suspended: boolean = false;

    try {
      const multiPartUploadResult: AWS.S3.Types.CreateMultipartUploadOutput = await s3.createMultipartUpload(s3Params).promise();
      uploadId = multiPartUploadResult.UploadId || '';
      let partNum: number = 0;
      for (let rangeStart: number = 0; rangeStart < fileSize; rangeStart += partSize) {
        partNum++;
        const end: number = Math.min(rangeStart + partSize, fileSize);
        const sendData: Blob = file.slice(rangeStart , end);

        const partParams: AWS.S3.Types.UploadPartRequest = {
          Body: sendData,
          PartNumber: partNum,
          UploadId: uploadId,
          ...otherParams as {Bucket: string, Key: string}
        };
        const partUpload = await s3.uploadPart(partParams).promise();
        if (checkIsSuspend && checkIsSuspend()) {
          suspended = true;
          break;
        }
        const progress: number = end / file.size;
        onPartUpload(progress * 100);
        multipartMap.Parts[partNum - 1] = {
          ETag: partUpload.ETag,
          PartNumber: partNum
        };
      }
    } catch (e) {
      failed = true;
    }

    if (!failed && !suspended) {
      const doneParams = {
        ...otherParams as {Bucket: string, Key: string},
        MultipartUpload: multipartMap,
        UploadId: uploadId
      };
      await s3.completeMultipartUpload(doneParams).promise().then(successCallback, errorCallback);
    } else {
      try {
        await s3.abortMultipartUpload({
          ...otherParams as {Bucket: string, Key: string},
          UploadId: uploadId
        }).promise();
      } catch (e) {
        // do nothing
      } finally {
        if (failed) {
          errorCallback();
        } else {
          if (suspendCallback) {
            suspendCallback();
          }
        }
      }
    }

  }

}
