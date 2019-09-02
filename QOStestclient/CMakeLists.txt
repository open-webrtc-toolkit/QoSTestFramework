cmake_minimum_required(VERSION 2.8)
project(owt_conf_sample)
set(configuration "Release")
set(builddir "${CMAKE_CURRENT_SOURCE_DIR}/out")

set(OWT_CONF_SAMPLE_VERSION_MAJOR 0)
set(OWT_CONF_SAMPLE_VERSION_MINOR 1)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIC -fno-exceptions -Wno-deprecated")

file(GLOB OWT_CONF_SAMPLE_SOURCES
  "${CMAKE_CURRENT_SOURCE_DIR}/conferencesample.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/conferenceforwardobserver.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/conferenceforwardobserver.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/fileframegenerator.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/fileframegenerator.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/encodedframegenerator.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/encodedframegenerator.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/videorenderer.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/videorenderer.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/data.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/data.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/log.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/log.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/http.cc"
  "${CMAKE_CURRENT_SOURCE_DIR}/http.h"
  "${CMAKE_CURRENT_SOURCE_DIR}/owt.h"
)

include_directories("${CMAKE_CURRENT_SOURCE_DIR}" "${CMAKE_CURRENT_SOURCE_DIR}/include/")
link_directories("${CMAKE_CURRENT_SOURCE_DIR}/libs/")

add_executable(owt_conf_sample ${OWT_CONF_SAMPLE_SOURCES})

set_target_properties(owt_conf_sample PROPERTIES RUNTIME_OUTPUT_DIRECTORY "${builddir}")
set_target_properties(owt_conf_sample PROPERTIES PREFIX "")
set_target_properties(owt_conf_sample PROPERTIES RUNTIME_OUTPUT_NAME "owt_conf_sample")
set_target_properties(owt_conf_sample PROPERTIES SUFFIX "")

set_property(TARGET owt_conf_sample PROPERTY CXX_STANDARD 14)
set_property(TARGET owt_conf_sample PROPERTY CXX_STANDARD_REQUIRED ON)

set_source_files_properties(${builddir}/owt_conf_sample PROPERTIES GENERATED "TRUE")


set_target_properties(owt_conf_sample PROPERTIES COMPILE_DEFINITIONS "WEBRTC_LINUX;WEBRTC_POSIX;USE_X11=1;")
#set_target_properties(owt_conf_sample PROPERTIES COMPILE_FLAGS "-std=gnu++11")

target_link_libraries(owt_conf_sample
  "-Wl,--start-group"
  "-lsioclient_tls"
  "-lssl"
  "-lcrypto"
  "-lowt"
  "-Wl,--end-group"
  "-lrt"
  "-lm"
  "-ldl"
  "-lX11"
  "-lXext"
  "-lXcomposite"
  "-lXrender"
  "-lXrandr"
  "-lXcursor"
  "-lXfixes"
  "-lXdamage"
  "-lpthread")

