#!/bin/bash

check_and_update ()
{
    pwd
    current_version=$(cat package.json | jq -r '.version')
    
    outdated_packages=$(npm outdated --json || true)
    
    if [ "$outdated_packages" == "{}" ] || [ -z "$outdated_packages" ]; then
        echo "All npm packages are up to date, current version $current_version"
    else
        echo "Updating packages..."
        npm update --no-audit --no-fund > /dev/null
        
        # Update version of microservice in package.json
        new_tag=$(npm version patch --no-git-tag-version)
        echo "Version number updated from $current_version to $new_tag"
        
        # 1. Update version in local README.md
        line_number=$(grep -n "## Version" README.md | cut -d ':' -f 1)
        if [ -n "$line_number" ]; then
            next_line_number=$((line_number + 1))
            current_date=$(date +"%Y-%m-%d")
            new_line="$new_tag $current_date"
            sed -i "${next_line_number}s/.*/$new_line/" README.md
        fi
        
        # 2. Update version and date in the master table (located 2 levels up in parent README.md)
        service_name=$(basename "$PWD" | tr '[:lower:]' '[:upper:]')
        master_readme="../../README.md"
        if [ -f "$master_readme" ]; then
            current_date=$(date +"%Y-%m-%d")
            # Matches the row starting with the service name and replaces its version & date columns
            sed -i -E "s/(\|$service_name\|[^|]*\|[^|]*\|)[^|]*\|[^|]*\|/\|\1${new_tag:1}|$current_date|/" "$master_readme"
            # echo "Updated master README.md table for $service_name to ${new_tag:1}"
        fi
        
        # Update version in execution file based on directory path
        file_dir="$PWD"
        file_name=""
        if [[ "$file_dir" == *"SPAs"* ]]; then
            file_name="./src/views/About.vue"
        elif [[ "$file_dir" == *"Data Services"* ]]; then
            file_name="./src/mongodbConnModule.js"
        elif [[ "$file_dir" == *"IoT Services"* ]]; then
            file_name="./src/app.js"
        fi
         # Update version of each changed package
        updated_packages=$(echo "$outdated_packages" | jq -r '. | keys[]')
        while IFS= read -r package; do
            version_number=$(npm show "$package" version)
            npm install --save-exact "$package@$version_number"  > /dev/null
            echo "Version number updated for $package to $version_number"
        done <<< "$updated_packages"
        echo "All packages successfully updated for ${new_tag:1}"
    fi
}

# --- NVM Safeguard & Node Version Enforcer ---
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    \. "$NVM_DIR/nvm.sh"  # Load NVM into the non-interactive script environment
    nvm use 24 > /dev/null 2>&1 || {
        echo "Node 24 not active, installing/switching..."
        nvm install 24 > /dev/null 2>&1
        nvm use 24 > /dev/null 2>&1
    }
fi

cd './Docker Based/IoT Services/ipas'
echo "IPAS Packages"
check_and_update
echo "==========================================="
cd ..ipls
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
cd ../mrom
echo "MROM Packages"
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
cd ../rods
echo "RODS Packages"
check_and_update
echo "==========================================="

