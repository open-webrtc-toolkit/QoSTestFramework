import subprocess
def get_devices():
        output = subprocess.check_output('adb devices', shell=True,)
        if len(output) == 0:
           return 1
        else:
            devicesArray="";
            results=output.split("\n");
            for index in range(len(results)):
                #print 'Current results :', results[index]
                if "device" in results[index]:
                  if not "devices" in results[index]:
                      deviceName=results[index].split('\t')
                      devicesArray=devicesArray+deviceName[0]+",";
        return devicesArray

if __name__ == '__main__':
  devicesArray = get_devices()
  print devicesArray.strip(",")