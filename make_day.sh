mkdir day_$1

cp templates/main.js day_$1/

touch day_$1/sample.txt
touch day_$1/input.txt

echo "adding sample.txt base on copied value"
pbpaste > day_$1/sample.txt

