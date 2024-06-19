// packageController

const Package = require('../models/Package');

//Create package
exports.createPackage = async(req, res) => {
    try {
        const { name, description, price, servicesIncluded } = req.body;
        const newPackage = new Package ({ name, description, price, servicesIncluded });
        await newPackage.save();

        res.status(201).json({
            message: "Package created successsfully",
            package: {id: newPackage._id, 
            name: newPackage.name, 
            description: newPackage.description, 
            price: newPackage.price, 
            servicesIncluded: newPackage.servicesIncluded}
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating package", error: error.message});
    }
};

//Get all packages 

exports.getAllPackages = async(req, res) => {
    try {
        const packages = await Package.find({});
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving packages", error: error.message});
    }
};


//Get a packages by ID

exports.getPackage = async(req, res) => {
    try {
        const packageId = req.params.id;
        const package = await Package.findById(packageId);
        if (!package) {
            return res.status(401).json({ message: "Package not found" });
        }
        res.json(package);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving package", error: error.message});
    }
}

// Update package by Id

exports.updatePackage = async (req, res) => {
    try {
        const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updatedPackage);
    } catch (error) {
        res.status(400).json({ message: "Error updating package", error: error.message});
    }
};

//Delete package by ID


exports.deletePackage = async(req, res) => {
    try {
        const packageId = req.params.id;
        const deletedPackage = await Package.findByIdAndDelete(packageId);
        if(!deletedPackage) {
            return res.status(404).json({ message: 'Package not found'})
        }
        res.json({ message: "Package deleted successfully"})
    } catch (error) {
        res.status(500).json({ message: "Error deleting package"});
    }
}