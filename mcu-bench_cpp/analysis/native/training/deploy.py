# Copyright (C) <2019> Intel Corporation
#
# SPDX-License-Identifier: Apache-2.0
import sys
caffe_root = '/home/webrtc/caffe/caffe/'
sys.path.insert(0, caffe_root + 'python')
from caffe import layers as L,params as P,to_proto
deploy='mnist/deploy.prototxt'   

def create_deploy():

    conv1=L.Convolution(bottom='data', kernel_size=5, stride=1,num_output=20, pad=0,weight_filler=dict(type='xavier'))
    pool1=L.Pooling(conv1, pool=P.Pooling.MAX, kernel_size=2, stride=2)
    conv2=L.Convolution(pool1, kernel_size=5, stride=1,num_output=50, pad=0,weight_filler=dict(type='xavier'))
    pool2=L.Pooling(conv2, pool=P.Pooling.MAX, kernel_size=2, stride=2)
    fc3=L.InnerProduct(pool2, num_output=500,weight_filler=dict(type='xavier'))
    relu3=L.ReLU(fc3, in_place=True)
    fc4 = L.InnerProduct(relu3, num_output=10,weight_filler=dict(type='xavier'))

    prob=L.Softmax(fc4)
    return to_proto(prob)
def write_deploy(): 
    with open(deploy, 'w') as f:
        f.write('name:"Lenet"\n')
        f.write('input:"data"\n')
        f.write('input_dim:1\n')
        f.write('input_dim:3\n')
        f.write('input_dim:28\n')
        f.write('input_dim:28\n')
        f.write(str(create_deploy()))
if __name__ == '__main__':
    write_deploy()
