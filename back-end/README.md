# This backend utilizes flask, a web application framework, to expose apis to our frontend.

## Libraries needed to run back end locally:

### Autogluon
1. pip3 install -U pip
2. pip3 install -U setuptools wheel
3. pip3 install torch==1.12+cpu torchvision==0.13.0+cpu torchtext==0.13.0 -f https://download.pytorch.org/whl/cpu/torch_stable.html
4. pip3 install autogluon

### Flask
pip install flask python-dotenv

### Pandas
pip install pandas

### sklearn
pip install -U scikit-learn

### aif360
pip install aif360

# When running the code:
all path variables will read/write to the directory that you run from, i.e. if you run this code from DP/ the working csv and model folders will reside in DP.
