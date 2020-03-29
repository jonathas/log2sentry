#!/bin/bash

aws lambda update-function-code --function-name $1 --s3-bucket lambda-deploy --s3-key `ts-node parseyml.ts $1` --profile myprofile