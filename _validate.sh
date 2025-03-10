#!/bin/bash
validator_jar=validator_cli.jar
input_cache_path=./input-cache/

# See if tx.fhir.org is online / reachable before disabling transa
echo Checking internet connection...
curl -sSf tx.fhir.org > /dev/null
if [ $? -eq 0 ]; then
	echo "Online"
	txoption=""
else
echo "Offline"
	txoption="-tx n/a"
fi

echo "$txoption"

export JAVA_TOOL_OPTIONS="$JAVA_TOOL_OPTIONS -Dfile.encoding=UTF-8"

cdaroot=http://hl7.org/cda/stds/core/StructureDefinition/
ccdaroot=http://hl7.org/cda/us/ccda/StructureDefinition/

#############################
# Set example to the filename from the input/examples folder
# Set profile to the CDA or C-CDA profile name
# (or pass in parameters as described below)
#############################

# example="test.xml"
# profile="SmokingStatus"

# example="average-bp-example.xml"
# profile="AverageBloodPressureOrganizer"

example="note-discharge.xml"
profile="HospitalCourseSection"

# example="indication-example.xml"
# profile="Entry"

# example="medical-equipment-organizer-example.xml"
# profile="MedicalEquipmentOrganizer"

# Pick the top one if testing against CDA instead of CCDA
#targetprofile=$cdaroot$profile
targetprofile=$ccdaroot$profile

#############################
# Can pass in example filename and profile
# Filename must end with .xml
# Profile must be a TitleCased profile name
# Include "cda" as a parameter to test against CDA instead of C-CDA
# Example: ./_validate.sh allergy-to-latex.xml Section cda
#############################
if [ $# -ge 2 ]; then
	cda=false
	profile_set=false
	for param in "$@"; do
		if [[ $param == "cda" ]]; then
			cda=true
		elif [[ $param == *.xml ]]; then
			example=$param
		elif [[ $param =~ ^[A-Z][a-zA-Z0-9]*$ ]]; then
			profile=$param
			profile_set=true
		fi
	done

	if $profile_set; then
		if $cda; then
			targetprofile=$cdaroot$profile
		else
			targetprofile=$ccdaroot$profile
		fi
	fi
fi


ig="hl7.cda.us.ccda#current"
#ig="input/resources -recurse"
#ig="http://hl7.org/cda/us/ccda/ImplementationGuide/hl7.cda.us.ccda|3.0.0-ballot"

# -watch-mode single    < to keep running
# -level errors         < to limit to errors

validator=$input_cache_path$validator_jar
if test -f "$validator"; then
	#java -jar $validator -ig output/package.tgz $txoption input/examples/$example -profile http://hl7.org/cda/us/ccda/StructureDefinition/$profile -want-invariants-in-messages $*
	java -jar $validator -ig $ig $txoption input/examples/$example -profile $targetprofile -html-output output/validation.html -watch-mode single
else
	echo FHIR Validator NOT FOUND in input-cache or parent folder.  Please run _updateValidator.  Aborting...
fi