import Snippet from "../models/SnippetModel.js";
import { getAISuggestion } from "../service/opanAi.js";
import { Activity } from "./../models/logs/ActivityModel.js";

const newSnippet = async (req, res) => {
  try {
    const snippetData = req.body;
    const snippet = await Snippet.create({
      ...snippetData,
      owner: req.user._id,
    });
    res.status(200).json({ snippet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در ساخت اسنیپت" });
  }
};

const getUserSnippets = async (req, res) => {
  try {
    const userSnippets = await Snippet.find({ owner: req.user._id });
    res.status(200).json({ userSnippets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در دریافت کدها" });
  }
};

const updateSnippet = async (req, res) => {
  try {
    const { snippetId, ...updateData } = req.body;
    const updated = await Snippet.findByIdAndUpdate(snippetId, updateData, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "کدی با این ID یافت نشد" });

    res.status(200).json({ message: "Updated successfully", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطا در بروزرسانی کد" });
  }
};

const requestSnippetPublicityApprovementByAdmin = async (req, res, _) => {
  try {
    const { snippetId } = req.body;

    await Snippet.findByIdAndUpdate(snippetId, {
      publicityStatus: "approving",
    });

    res.status(200).json({ message: "درخواست شما ارسال شد." });
  } catch (err) {
    res.status(500);
  }
};

const approveSnippetPublicity = async (req, res, _) => {
  try {
    const { snippetId } = req.body;

    await Snippet.findByIdAndUpdate(snippetId, { publicityStatus: "public" });

    res.status(200).json({ message: "اسنیپت عمومی شد" });
  } catch (error) {
    res.status(500);
  }
};

const getSingleSnippet = async (req, res, _) => {
  try {
    const {id: snippetId} = req.params;

    const snippet = await Snippet.findOne({_id: snippetId});

    if(!snippet) res.status(404).json({message: 'اسنیپت وجود ندارد'});

    res.status(200).json({snippet})

  } catch (error) {
    res.status(500);
  }
}

//  R E C O M M E N D A T I O N --  A L G O

const getPublicSnippets = async (req, res, _) => {
  try {
    const { _id: userId } = req.user;

    const userActivities = await Activity.find({ userId });

    // const snippets = await Snippet.find({publicityStatus: "public"});

    // if(!snippets) res.status(400).json({message: 'هیچ قطعه کد عمومی یافت نشد'});

    res.status(200).json({});
  } catch (error) {
    res.status(500);
  }
};


const optimizeSippetAI = async (req, res, _) => {
   try {
    const {inputCode} = req.body;

    const {code} = await getAISuggestion(inputCode)
    

    res.status(200).json({code})

   } catch (error) {
    res.status(500).json({error: error.message})
   }
}

export default {
  newSnippet,
  getUserSnippets,
  updateSnippet,
  requestSnippetPublicityApprovementByAdmin,
  approveSnippetPublicity,
  getPublicSnippets,
  getSingleSnippet
};
