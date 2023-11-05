const Expense = require('../models/expenses');
const User = require('../models/users');
const sequelize= require('../util/database');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');

const addExpense = async (req, res) => {
    try {
        const t = await sequelize.transaction();

        const { amount, description, category } = req.body;
        console.log('Request body:', req.body);

        if (amount === undefined || description === undefined || category === undefined) {
            return res.status(400).json({ success: false, message: 'Parameters missing' });
        }

        const expense = await Expense.create(
            { amount, description, category, userId: req.user.id },
            { transaction: t }
        );

        const totalexpenses = Number(req.user.totalexpenses) + Number(amount);
        console.log(totalexpenses);

        await User.update(
            { totalexpenses: totalexpenses },
            { where: { id: req.user.id }, transaction: t }
        );

        await t.commit();
        return res.status(201).json({ success: true, expense });
    } catch (err) {
        if (t) {
            await t.rollback();
        }
        console.error(err);
        return res.status(500).json({ success: false, error: err.message || 'Operation failed' });
    }
};


const getExpenses = async (req, res) => {
    try {
        const expenses = await req.user.getExpenses();
        return res.status(200).json({ success: true, expenses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: 'Failed to fetch expenses' });
    }
};

const downloadExpenses =  async (req, res) => {

    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING; // check this in the task. I have put mine. Never push it to github.
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

        // V.V.V.Imp - Guys Create a unique name for the container
        // Name them your "mailidexpensetracker" as there are other people also using the same storage

        const containerName = 'yahooexpensetracker'; //this needs to be unique name

        console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = await blobServiceClient.getContainerClient(containerName);

        //check whether the container already exists or not
        if(!containerClient.exists()){
            // Create the container if the container doesnt exist
            const createContainerResponse = await containerClient.create({ access: 'container'});
            console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
        }
        // Create a unique name for the blob
        const blobName = 'expenses' + uuidv1() + '.txt';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // Upload data to the blob as a string
        const data =  JSON.stringify(await req.user.getExpenses());

        const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
        console.log("Blob was uploaded successfully. requestId: ", JSON.stringify(uploadBlobResponse));

        //We send the fileUrl so that the in the frontend we can do a click on this url and download the file
        const fileUrl = `https://demostoragesharpener.blob.core.windows.net/${containerName}/${blobName}`;
        res.status(201).json({ fileUrl, success: true}); // Set disposition and send it.
    } catch(err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong'})
    }

};


const deleteExpense = async (req, res) => {
    const expenseId = req.params.expenseid;

    if (expenseId === undefined || expenseId.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
    }

    try {
        
        const expense = await Expense.findOne({
            where: { id: expenseId, userId: req.user.id }
        });

        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense doesn't belong to the user" });
        }

        const amountToDelete = expense.amount;

        
        const t = await sequelize.transaction();

        
        await Expense.destroy({ where: { id: expenseId, userId: req.user.id }, transaction: t });

        
        const updatedTotalExpenses = Number(req.user.totalexpenses) - Number(amountToDelete);
        await User.update(
            { totalexpenses: updatedTotalExpenses },
            { where: { id: req.user.id }, transaction: t }
        );

        
        await t.commit();

        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err);
        if (t) {
            await t.rollback();
        }
        return res.status(500).json({ success: false, error: 'Failed to delete expense' });
    }
};


module.exports = {
    deleteExpense,
    getExpenses,
    addExpense,
    downloadExpenses
};

