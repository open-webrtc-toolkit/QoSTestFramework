#!/bin/bash
#
# The script takes the path to the folder containing videofiles as the input and calculates all the metrics 
# additionaly storing the results in the CSV (Comma Separated Values) files
#
# Inform not to use the names of the folders with the spaces inside
echo
# Check for the input validity
if [ -z "$1" ]; then
	echo "  No path to the folder with videos/photos given"
	echo
	cat << EOF
  Usage: 

    $(basename $0) <path_to_folder_with_videos/photos> <path_to_mitsu_metrics_binary>

EOF
	exit
fi
if [ -z "$2" ]; then
	echo "  No path to the binary file given"
	echo 
	cat << EOF
  Usage: 

    $0 <path_to_folder_with_videos/photos> <path_to_mitsu_metrics_binary>

EOF
	exit
fi

# Make the directory for the output files
DIR="mitsu_metrics$(date +%Y%m%d)"
echo "Creating the $DIR directory or using the exitent one..."
mkdir -p $DIR
cd $DIR
echo "All results will be stored in $DIR"

# Create a file for storing all the results
ALL_FILE="results-all_$(date +%Y%m%d%H%M%S).csv"
touch $ALL_FILE

# Read the folder path with the clips
FOLDER="$1"
if [ $FOLDER = "." ]; then
	FOLDER=""
fi
# Read the binary file
EXECUTABLE="$2"

# Changing the IFS to enable processing of filenames containing spaces
SAVEIFS=$IFS
IFS=$(echo -en "\n\b")

# Iterate over the files in the source folder
for VIDEOFILE in $(ls ../"${FOLDER}"); do
	# Skip the calculations if the file is a directory
	if [ -d "../${VIDEOFILE}" ]; then
		echo "$VIDEOFILE is a directory -> skip it..."
	elif [ "${VIDEOFILE##*.}" = "yuv" ]; then
		echo "$VIDEOFILE is in a RAW format -> skip it..."
	elif [ "${VIDEOFILE##*.}" = "txt" ]; then
		echo "$VIDEOFILE is a text file -> skip it..."
	else
		# Do somehting if the file is the videofile
		echo "*************************************************"
		echo "Starting the calculations for the "$VIDEOFILE"..."
		echo
		# Extracting the sole filename (w/o the path)
		FILENAME=${VIDEOFILE%.*}

		# Changing to the full path for the single file
		VIDEOFILE=../"${FOLDER}"/"$VIDEOFILE"

		# Read the dimensions of the video frame and the FPS
		WIDTH="$(ffprobe -v error -show_entries stream=width -of default=noprint_wrappers=1:nokey=1 "$VIDEOFILE")"
		# Make sure that there is only ony width read
		set -- $WIDTH
		WIDTH=$1
		HEIGHT="$(ffprobe -v error -show_entries stream=height -of default=noprint_wrappers=1:nokey=1 "$VIDEOFILE")"
		# Make sure that there is only one height read
		set -- $HEIGHT
		HEIGHT=$1
		# If file is the photo, ommit the FPS calculus
		EXTENSION="${VIDEOFILE##*.}"
		if [ "$EXTENSION" = "png" -o "$EXTENSION" = "PNG" -o "$EXTENSION" = "jpg" -o "$EXTENSION" = "JPG" -o "$EXTENSION" = "jpeg" -o "$EXTENSION" = "JPEG" -o "$EXTENSION" = "bmp" -o "$EXTENSION" = "BMP" ]; then
			FPS=1
		else
			FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 "$VIDEOFILE")
			FPS=$(echo "scale=2; $FPS" | bc) # reduce the FPS to 2 digits after dot precision
			# Make sure that there is only one FPS read
			set -- $FPS
			FPS=$1
		fi
		echo "Parameters of the video stream:"
		printf "Width:\t$WIDTH\n"
		printf "Height:\t$HEIGHT\n"
		printf "FPS:\t$FPS\n"
		echo

		# Convert the first 10 seconds of the file to the yuv format and save the ffmpeg output to the log file
		echo "Uncompressing using the ffmpeg..."
		YUV="$FILENAME.yuv"
		LOGFILE="ffmpeglog-$FILENAME-$(date +%Y%m%d%H%M%S).txt"
		ffmpeg -i "$VIDEOFILE" -pix_fmt yuv420p -hide_banner "$YUV" &> "$LOGFILE"
		echo "Output of the ffmpeg stored in the $LOGFILE"
		echo

		# Calculate the metrics on the file and save the output in the results.txt
		RESULTS="results-$FILENAME.csv"
		OUTPUT="out.txt"
		echo "Calculating the metrics on the uncompressed video stream..."
		"$EXECUTABLE" "$YUV" $WIDTH $HEIGHT $FPS > $OUTPUT
		echo "Done!"
		echo 
		cat $OUTPUT | grep 'Calculation time'
		cat $OUTPUT | grep 'milliseconds per frame'
		rm $OUTPUT
		mv metricsResultsCSV.csv "$RESULTS"
		echo
		echo "Results saved in the $RESULTS file"
		echo

		# Append the results to the one big file
		echo $FILENAME >> $ALL_FILE
		cat $RESULTS >> $ALL_FILE

		# Remove the uncompressed file
		echo "All computations done."
		echo "Removing the $YUV file..."
		echo
		rm "$YUV"
	fi
done

# Go back to the main directory
cd ..

# Loading IFS variable with the default value
IFS=$SAVEIFS

echo "For all the results placed in one spread sheet please take a look at ${DIR}/${ALL_FILE} file."
echo "Exiting the script..."
exit