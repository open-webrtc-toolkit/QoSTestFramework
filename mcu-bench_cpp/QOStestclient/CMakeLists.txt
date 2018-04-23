cmake_minimum_required(VERSION 2.8)
project(woogeen_conf_sample)
set(configuration "Release")
set(builddir "${CMAKE_CURRENT_SOURCE_DIR}/out")

set(WOOGEEN_CONF_SAMPLE_VERSION_MAJOR 0)
set(WOOGEEN_CONF_SAMPLE_VERSION_MINOR 1)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -fno-exceptions -Wno-deprecated")

file(GLOB WOOGEEN_CONF_SAMPLE_SOURCES
  "${CMAKE_CURRENT_SOURCE_DIR}/conferencesample.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/conferencesampleforwardobserver.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/conferencesampleforwardobserver.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/fileframegenerator.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/fileframegenerator.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/fileaudioframegenerator.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/fileaudioframegenerator.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/encodedframegenerator.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/encodedframegenerator.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/directvideodecoder.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/directvideodecoder.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/directvideoencoder.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/directvideoencoder.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/basicserverConnector.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/basicserverConnector.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/myVideoRenderer.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/myVideoRenderer.h"  
)

include_directories("${CMAKE_CURRENT_SOURCE_DIR}" "${CMAKE_CURRENT_SOURCE_DIR}/include/")
link_directories("${CMAKE_CURRENT_SOURCE_DIR}/libs/")

add_executable(woogeen_conf_sample ${WOOGEEN_CONF_SAMPLE_SOURCES})

set_target_properties(woogeen_conf_sample PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${builddir}")
set_target_properties(woogeen_conf_sample PROPERTIES PREFIX "")
set_target_properties(woogeen_conf_sample PROPERTIES RUNTIME_OUTPUT_NAME "woogeen_conf_sample")
set_target_properties(woogeen_conf_sample PROPERTIES SUFFIX "")

set_property(TARGET woogeen_conf_sample PROPERTY CXX_STANDARD 14)
set_property(TARGET woogeen_conf_sample PROPERTY CXX_STANDARD_REQUIRED ON)

set_source_files_properties(${builddir}/woogeen_conf_sample PROPERTIES GENERATED "TRUE")


set_target_properties(woogeen_conf_sample PROPERTIES COMPILE_DEFINITIONS "WEBRTC_LINUX;WEBRTC_POSIX;USE_X11=1;")
#set_target_properties(woogeen_conf_sample PROPERTIES COMPILE_FLAGS "-std=gnu++11")

target_link_libraries(woogeen_conf_sample
  "-Wl,--start-group"
  "-lasiotoken"  
  "-lboost_date_time"
  "-lboost_random"
  "-lsioclient_tls"
  "-lics"
  "-Wl,--end-group"
  "-lrt"
  "-lm"
  "-ldl"
  "-lX11"
  "-lXext"
  "-lssl"
  "-lcrypto"
  "-lXcomposite"
  "-lXrender"
  "-lXrandr"
  "-lXcursor"
  "-lXfixes"
  "-lXdamage"
  "-lpthread"
  "-lboost_system")
