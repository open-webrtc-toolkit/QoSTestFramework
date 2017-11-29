#coding=utf-8
import sys
caffe_root = '/home/yonghao/machine-learning/caffe/'
sys.path.insert(0, caffe_root + 'python')
import caffe
import numpy as np

deploy='mnist/deploy.prototxt'
caffe_model='mnist/lenet_iter_10000.caffemodel'
img='8.jpg'
labels_filename = 'mnist/test/labels.txt'

net = caffe.Net(deploy,caffe_model,caffe.TEST)

transformer = caffe.io.Transformer({'data': net.blobs['data'].data.shape})
transformer.set_transpose('data', (2,0,1))
#transformer.set_mean('data', np.load(mean_file).mean(1).mean(1))   
transformer.set_raw_scale('data', 255)
transformer.set_channel_swap('data', (2,1,0))

im=caffe.io.load_image(img)              
net.blobs['data'].data[...] = transformer.preprocess('data',im)      

out = net.forward()

labels = np.loadtxt(labels_filename, str, delimiter='\t') 
prob= net.blobs['Softmax1'].data[0].flatten()
print prob
order=prob.argsort()[-1]
print 'the class is:', labels[order], 'Prob', prob[order]
