#
# PreBuild.ps1: Pre build utility
#

param (
	[Parameter(Mandatory=$true)][string] $ProjectDir
)

# Set correct location
Set-Location $ProjectDir

# Run webpack
./node_modules/.bin/webpack
