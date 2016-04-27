#!/bin/sh
echo "Deploy Home Services..."

process_id=`ps -ef | grep ./homeServices | grep -v "grep" | awk '{print $2}'`

# make sure LOG_DIR exists
if [ $process_id ]; then
    echo "Got running process...: " $process_id
	echo "Killing process with id ..." $process_id
	kill -9 $process_id
fi

cd /home/ubuntu

DATE=`date  +"%Y%m%d-%H%M"`
ARCHIVE_DIR=archive/home-services/$DATE

echo "Archiving current application to " $ARCHIVE_DIR
mkdir -p $ARCHIVE_DIR

mv home-services/* ./$ARCHIVE_DIR

cd home-services
tar xf /home/ubuntu/deploy/application.tar

echo "Re-start home services server"

nohup ./homeServices >startup.log 2>&1 </dev/null &

echo "Home Services Server Deploy Completed..."

exit;
