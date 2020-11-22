#!/bin/bash

aws lambda update-function-code --function-name myfunctionname --s3-bucket mybucket --s3-key `ts-node parseyml.ts myfunctionname` --profile myprofile