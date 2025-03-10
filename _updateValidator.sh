#!/bin/bash
valsource=https://github.com/hapifhir/org.hl7.fhir.core/releases/latest/download/
validator_jar=validator_cli.jar
dlurl=$valsource$validator_jar

input_cache_path=$PWD/input-cache/

skipPrompts=false
FORCE=false

if ! type "curl" > /dev/null; then
	echo "ERROR: Script needs curl to download latest Validator. Please install curl."
	exit 1
fi

while [ "$#" -gt 0 ]; do
    case $1 in
    -f|--force)  FORCE=true ;;
    -y|--yes)  skipPrompts=true ; FORCE=true ;;
    *)  echo "Unknown parameter passed: $1.  Exiting"; exit 1 ;;
    esac
    shift
done

echo "Checking internet connection"
curl -sSf tx.fhir.org > /dev/null

if [ $? -ne 0 ] ; then
  echo "Offline (or the terminology server is down), unable to update.  Exiting"
  exit 1
fi

if [ ! -d "$input_cache_path" ] ; then
  if [ $FORCE != true ]; then
    echo "$input_cache_path does not exist"
    message="create it?"
    read -r -p "$message" response
    else
    response=y
  fi
fi

if [[ $response =~ ^[yY].*$ ]] ; then
  mkdir ./input-cache
fi

validator="$input_cache_path$validator_jar"

if test -f "$validator" ; then
	echo "FHIR Validator FOUND in input-cache"
	jarlocation="$validator"
	jarlocationname="Input Cache"
	upgrade=true
else
	validator="../$validator_jar"
	upgrade=true
	if test -f "$validator"; then
		echo "FHIR Validator FOUND in parent folder"
		jarlocation="$validator"
		jarlocationname="Parent Folder"
		upgrade=true
	else
		echo "FHIR Validator NOT FOUND in input-cache or parent folder"
		jarlocation=$input_cache_path$validator_jar
		jarlocationname="Input Cache"
		upgrade=false
	fi
fi

if [[ $skipPrompts == false ]]; then

  if [[ $upgrade == true ]]; then
    message="Overwrite $jarlocation? (Y/N) "
  else
    echo Will place validator jar here: "$jarlocation"
    message="Ok (enter 'y' or 'Y' to continue, any other key to cancel)?"
  fi
  read -r -p "$message" response
else
  response=y
fi
if [[ $skipPrompts == true ]] || [[ $response =~ ^[yY].*$ ]]; then

	echo "Downloading most recent validator to $jarlocation - it's ~150 MB, so this may take a bit"
	curl -L $dlurl -o "$jarlocation" --create-dirs
else
	echo cancelled validator update
fi
