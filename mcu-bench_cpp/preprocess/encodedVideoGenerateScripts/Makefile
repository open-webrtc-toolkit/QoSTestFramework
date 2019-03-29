
BUILD=/usr/local

CFLAGS := \
	-Wall -g \
	-D__STDC_CONSTANT_MACROS \
	-Wno-deprecated-declarations \
	-I$(BUILD)/include

LDLIBS := \
	-lm \
	-L$(BUILD)/lib \
	-lavformat \
	-lavcodec \
	-lavutil \
	-lswresample

.phony: all clean

targets = genTestStream

all: $(targets)

$(targets): %: %.cpp
	        gcc $(CFLAGS) $< -o $@ $(LDLIBS)

clean:
	$(RM) $(targets)
