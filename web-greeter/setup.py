from cx_Freeze import setup, Executable
import os

setup_dir = os.path.abspath(os.path.dirname(__file__))
os.chdir(setup_dir)

long_description = ""

if os.path.exists(os.path.join(setup_dir, "README.md")):
    with open("README.md", "r", encoding="utf-8") as fh:
        long_description = fh.read()

setup(
    name = "web-greeter",
    version = "3.0.0",
    license = 'GPL-3.0',
    author = "Antergos Linux Project, Jezer Mejía",
    author_email = "amyuki4@gmail.com",
    description = "A modern, visually appealing greeter for LightDM",
    long_description = long_description,
    long_description_content_type="text/markdown",
    executables = [Executable("__main__.py", target_name="web-greeter")],
    options = {"build_exe": {
                "build_exe": "dist",
                "packages": ["gi", "Xlib"],
                "includes": ["gi"],
                "silent_level": 0,
                }},
    )
