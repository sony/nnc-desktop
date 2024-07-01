# Neural Network Console Checklist

This document uses Ubuntu20.04 as an example. There may be variations on different platforms.

There are seven modules need to be checked.  
- Project  
- Dashboard   
- Dataset  
- Job History  
- Sample Project  
- Help  

## For `Project`  
    
There are two modules need to be checked.  
  
- New Project  
- Import Project  
  
### `New Project`  

This function aims to create new project.  

Test steps:

   
1. Click `New Project` tab, enter the project name in the pop-up window, then click `OK`.
 eg: test-demo. As follow:  
 
![set dataset](/docs/images/demo.png)


2. Create new Neural Network model. You can refer to the following:  
 
![Neural Network model](/docs/images/net-model.png)

 
3. Config dataset, click `DATASET` tab. Then, click `Not Set` icon to set data separately for `Training` and `Validation`.  
 
![set dataset](/docs/images/set-data.png)

 
4. Click `CONFIG` icon, config related parameters.
 

5. Click `run` icon for trainning. After jobs finished, download follows files, check converted material (eg:*.onnx, *.pb, *.nnp, *.nnb):  
 Note: Is it blank?  Can non-binary files be opened with actual content?
- NNB(NNabla C Runtime file format)
- ONNX
- NNP(Nerual Network libraries file format)
- NNP of the best epoch
- NNP of the last epoch
- Tensorflow frozen graph
- html beta

 

 
6. Click `run` icon for evaluation. After jobs finished, download follows files, check converted material (eg:*.onnx, *.pb, *.nnp, *.nnb):  
  Note: Is it blank?  Can non-binary files be opened with actual content?
- NNP + Evaluation result
- NNB(NNabla C Runtime file format)
- ONNX
- NNP of the best epoch
- NNP of the last epoch
- Tensorflow frozen graph
- html beta


### `Import Project`  

This function aims to upload new project.  

Test steps:  

 
 1. Click Import Project icon. Pop-up a window, as follow:
 
 ![import project](/docs/images/Upload.png)

 
 2. Click on the gray area to select the loaded file or drop file to the gray area.
 

## For `Dashboard`

There are two functions need to be checked. 
- Recent Projects 
- Recent Jobs 

Test steps:  

### `Recent Projects`  

This function shows the historical projects of runned recently.  

Test steps:  

 
 1. Review Whether to display historical projects that have been created
 
 
 2. Click historical projects, enter project editor page.
 

### `Recent Jobs`
This function shows the historical jobs of runned recently.  

Test steps:

 
 1. Review Whether to display historical jobs that have been created
 
 
 2. Click historical jobs, enter job result page.
 

## For `Dataset`

This module mainly tests the function of importing data.  

Test steps:

 
 1. You can create a folder in `~/nncd_bucket` path. In the folder, you must contain `data` folder for place data and `index.csv` file for index data.
 

 
 2. Click `Dataset` tab in main page, then click `Import Dataset` icon, input name of folder.   
 

 
 3. If the folder import is successful, the Dataset main page will display the folder name.   
 

## For `Job History`

The module records history logs of created jobs here.

Test steps: 

 
 1. Check if the history logs is correct.  
 

## For `Sample Project`  

The module records several sample project of Neural Network model for different purpose.  

 - Image recognition.
 - Image generation.
 - Image segmentation.
 - ...  

Test steps:

 
 1. You can choose the model you are interested for testing. Then click `Download` icon to download model file. (eg: *.sdcproj)

 2. Please refer to the next steps about [Upload Project](#upload-project) in details.
 
 Note: Dependent data of model needs to be collected by yourself.  
   

## For `Help`

The module contains `Docs & Tutorials` and `About`.  
### `Docs & Tutorials`

`Docs & Tutorials` is the user manual related to Neural Network Console.  

Test steps:  

 
 1. Click `Docs & Tutorials` icon, Check out the manual.
 
 
 2. Review tutorial video.
 

### `About`

`About` is the version information related to Neural Network Console.  

Test steps:  

 
 1. Click About icon. Check if a pop-up window exists. As follow:  
 
![About window](/docs/images/About.png)
