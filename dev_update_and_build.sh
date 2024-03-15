# Updating
cd ../swingmusic || exit -1
git pull || exit -2
cd ../swingmusic-client || exit -3
git pull || exit -4

# Cleanup
cd ../swingmusic || exit -5
rm -rf client/* || exit -6
rm -rf build dist || exit -7

# Build the client
cd ../swingmusic-client || exit -8
yarn build --outDir ../swingmusic/client/ || exit -9

# Build the server
cd ../swingmusic || exit -10
poetry run python manage.py --build || exit -11

# Copying the client to the appropriate location
echo "Done building. Moving to the next step"
cp -r  dist/swingmusic ../swingmusic-desktop/swingmusic_bin || exit -12
echo "Done copying. Done."