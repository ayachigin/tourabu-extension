module Main where

import Data.Maybe (fromMaybe)

import qualified System.IO.UTF8 as U
import System.Environment (getArgs)
import System.Exit (ExitCode)
import System.Process (system)

import Text.Regex

main :: IO ExitCode
main = do
  args <- getArgs
  let option = if null args then "fix" else head args
  makeTempDirectory
  -- makeBuildDirecotry
  newVersionStr <- modifyManifest option
  copyFilesToBuild
  createZipArchive newVersionStr
  removeTempDirecotry
  system "echo complete"

copyFilesToBuild :: IO ExitCode
copyFilesToBuild = do
  system "cp -r assets temp/"
  system "cp -r src temp/"
  system "cp manifest.json temp/"


makeTempDirectory :: IO ExitCode
makeTempDirectory = do
  system "mkdir temp"

removeTempDirecotry :: IO ExitCode
removeTempDirecotry = do
  system "rm -rf temp"

makeBuildDirecotry :: IO ExitCode
makeBuildDirecotry = do
  system "mkdir build"

cleanUpBuildDirectory :: IO ExitCode
cleanUpBuildDirectory = do
  system "rm -rf build"
  system "echo clean up build directory"
  system "mkdir build"
                         
createZipArchive :: String -> IO ExitCode
createZipArchive ver = do
  system "echo creating zip archive..."
  system $ "zip -r build/ToukenRanbuExtension" ++ ver ++ ".zip ./temp"


modifyManifest :: String -> IO String
modifyManifest option = do
  print "modify/start"
  s <- U.readFile "manifest.json"
  case modifyVersionNumber option s of
     (Just (newManifest, newVersionStr)) ->
       U.writeFile "manifest.json" newManifest >>
       return newVersionStr

modifyVersionNumber :: String -> String -> Maybe (String, String)
modifyVersionNumber option s = do
  (major:_) <- matchRegex (mkRegex "([0-9]+)[.][0-9]+[.][0-9]+") s
  (minor:_) <- matchRegex (mkRegex "[0-9]+[.]([0-9]+)[.][0-9]+") s
  (fix:_)   <- matchRegex (mkRegex "[0-9]+[.][0-9]+[.]([0-9]+)") s
  let newVersionStr = case option of
                        "major" -> incr major ++ ".0.0"
                        "minor" -> major ++ "." ++ incr minor ++ ".0"
                        (_)     -> major ++ "." ++ minor ++ "." ++ incr fix
  return $ (subRegex (mkRegex "[0-9]+[.][0-9]+[.][0-9]+") s newVersionStr, newVersionStr)
     where
       incr i = show . succ $ (read i :: Int)
