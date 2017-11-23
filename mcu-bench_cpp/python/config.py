class ConfigKeys(object):
  ANDROID_CONFERENCE_QOS_CONFIG_FOLDER = 0
  ANDROID_P2P_QOS_CONFIG_FOLDER = 1

class Config(object):
  config = {
            ConfigKeys.ANDROID_CONFERENCE_QOS_CONFIG_FOLDER: r"/home/fengwei/zyh_android/0726/webrtc-android-sdk/test/conferenceQosTest",
            ConfigKeys.ANDROID_P2P_QOS_CONFIG_FOLDER: r"/home/fengwei/zyh_android/0726/webrtc-android-sdk/test/p2pQosTest"
           }
  @staticmethod
  def getConfig(key):
    if key in Config.config.keys():
      return Config.config[key]
    else:
      return None
  @staticmethod
  def setConfig(key, value):
    raise Exception("Not Implement")
