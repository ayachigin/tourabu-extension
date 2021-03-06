module Main where

import Control.Monad (when)
import Data.List (isInfixOf)
--import qualified System.IO.UTF8 as U
import System.Environment (getArgs)
import System.Exit (ExitCode, exitFailure)
import System.Process (system)
import System.Directory (setCurrentDirectory, createDirectoryIfMissing)

import Text.Regex

main :: IO ExitCode
main = do
  _ <- system "chcp 65001"
  args <- getArgs
  when (elem "help" args) $ putStrLn "build [fix|minor|major]" >> exitFailure
  let option = if null args then "fix" else head args
  newVersionStr <- modifyManifest option
  let dirName = "build/TourabuExtension" ++ newVersionStr ++ "/"
  makeTempDirectory dirName
  copyFilesToBuild dirName
  removeChromeReload dirName
  createZipArchive dirName
  -- removeTempDirecotry dirName
  system "echo complete"

removeChromeReload :: String -> IO ()
removeChromeReload dirName = do
  s <- readFile $ "app/manifest.json"
  writeFile (dirName ++ "manifest.json") $ remomveReload s
  system $ "rm " ++ dirName ++ "scripts/chromereload.js"
  return ()
    where
      remomveReload = unlines .
                      filter (\x -> not ("chromereload"`isInfixOf` x)) . lines


copyFilesToBuild :: String -> IO ExitCode
copyFilesToBuild dirName = do
  system $ "cp -r app/styles " ++ dirName
  system $ "cp -r app/scripts " ++ dirName
  system $ "rm " ++ dirName ++ "scripts/*.map"
  system $ "cp -r app/sound " ++ dirName
  createDirectoryIfMissing True $ dirName ++ "ocrad.js"
  system $ "cp app/ocrad.js/ocrad.js " ++ dirName ++ "ocrad.js/"
  system $ "cp -r app/libs " ++ dirName
  system $ "cp -r app/images " ++ dirName
  system $ "cp app/*.html " ++ dirName
  system $ "cp app/manifest.json " ++ dirName


makeTempDirectory :: String -> IO ()
makeTempDirectory dirName = do
  createDirectoryIfMissing True dirName

removeTempDirecotry :: String -> IO ExitCode
removeTempDirecotry dirName = do
  system $ "rm -rf " ++ dirName

createZipArchive :: String -> IO ()
createZipArchive dirName = do
  let fileName = takeWhile (/='/') . tail . snd . break (=='/') $ dirName
  print fileName
  setCurrentDirectory "build"
  system "echo creating zip archive..."
  system $ "zip -r ../package/" ++ fileName ++ ".zip ./" ++ fileName ++ "/"
  setCurrentDirectory ".."


modifyManifest :: String -> IO String
modifyManifest option = do
  s <- readFile "app/manifest.json"
  case modifyVersionNumber option s of
     (Just (newManifest, newVersionStr)) ->
       writeFile "app/manifest.json" newManifest >>
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
      newManifest = subRegex (mkRegex "[0-9]+[.][0-9]+[.][0-9]+") s newVersionStr
  return $ (newManifest, newVersionStr)
     where
       incr i = show . succ $ (read i :: Int)
