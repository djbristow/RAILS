#!/bin/bash

check_and_update ()
{
    # Check for outdated packages
    current_version=$(cat package.json | jq -r '.version' )
    outdated_packages=$(npm outdated --json)
    if [ "$outdated_packages" == "{}" ]; then
        echo "All npm packages are up to date, current version $current_version"
    else
        npm update > /dev/null
        # Update version of microservice in package.json
        version_number=$(npm version patch)
        echo "Version number updated from $current_version to $version_number"
        # Update version in README.md
        line_number=$(grep -n "## Version" README.md | cut -d ':' -f 1)
        next_line_number=$((line_number + 1))
        current_date=$(date +"%Y-%m-%d")
        new_line="$version_number $current_date"
        sed -i "${next_line_number}s/.*/$new_line/" README.md
        # Update version in execution file
        file_dir="$PWD"
        if [[ "$file_dir" == *"SPAs"* ]]; then
            file_name="./src/views/About.vue"
        fi
        if [[ "$file_dir" == *"Data Services"* ]]; then
            file_name="./src/mongodbConnModule.js"
        fi
        if [[ "$file_dir" == *"IoT Services"* ]]; then
            file_name="./src/app.js"
        fi
        sed -i "s/$current_version/${version_number:1}/" $file_name
        # Update version of each changed package
        updated_packages=$(echo "$outdated_packages" | jq -r '. | keys[]')
        while IFS= read -r package; do
            version_number=$(npm show "$package" version)
            npm install --save-exact "$package@$version_number"  > /dev/null
            echo "Version number updated for $package to $version_number"
        done <<< "$updated_packages"
    fi
}
cd './Docker Based/IoT Services/ipls'
echo "IPLS Packages"
check_and_update
echo "==========================================="
cd ../ipts
echo "IPTS Packages"
check_and_update
echo "==========================================="
cd ../isbs
echo "ISBS Packages"
check_and_update
echo "==========================================="
cd ../isms
echo "ISMS Packages"
check_and_update
echo "==========================================="
cd ../isrs
echo "ISRS Packages"
check_and_update
echo "==========================================="
cd ../ists
echo "ISTS Packages"
check_and_update
echo "==========================================="
cd ../../SPAs/mrim
echo "MRIM Packages"
check_and_update
echo "==========================================="
cd ../mppm
echo "MPPM Packages"
check_and_update
echo "==========================================="
cd ../mrlm
echo "MRLM Packages"
check_and_update
echo "==========================================="
cd ../rsrm
echo "RSRM Packages"
check_and_update
echo "==========================================="
cd '../../Data Services/mrfm'
echo "MRFM Packages"
check_and_update
echo "==========================================="
cd ../ppds
echo "PPDS Packages"
check_and_update
echo "==========================================="
cd ../rids
echo "RIDS Packages"
check_and_update
echo "==========================================="
cd ../rlds
echo "RLDS Packages"
check_and_update
echo "==========================================="

