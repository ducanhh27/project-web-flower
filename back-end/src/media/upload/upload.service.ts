import { PutObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
    export class UploadService{
        private readonly s3Client= new S3Client({
            region:'us-east-1',
            credentials:{
                accessKeyId:process.env.ACCESS_KEY_ID_AWS ?? '',
                secretAccessKey:process.env.SECRET_ACCESS_KEY_AWS ?? ''
            }
        })

        async upload(fileName:string, file: Buffer){
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket:'kltnimgstore',
                    Key:fileName,
                    ACL: 'public-read',
                    Body:file
                })
            )
            return `https://kltnimgstore.s3.us-east-1.amazonaws.com/${fileName}`;

        }
    }