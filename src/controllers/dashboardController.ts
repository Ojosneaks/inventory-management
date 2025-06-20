import {Request, Response} from 'express';
import {PrismaClinet} from '@prisma/client';

const prisma = new PrismaClinet();

export const getDashboardMetrics = async (req: Request, res: Response): 
 Promise<void> => {
    try{
        const popularProducts = await prisma.product.findMany({ 
            take:15,
            orderBy: {
                stockQuanity: "desc",
            },
        });
     const saleSummary = await prisma.salesSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const purchaseSummary = await prisma.purchaseSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });

        const expenseSummary = await prisma.expenseSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });

        const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });

        const expenseByCategory = expenseByCategorySummaryRaw.map(
            (item) => ({
                ...item,
                amount: item.amount.toString()
            }));
    
     res.json({
        popularProducts,
        saleSummary,
        purchaseSummary,
        expenseSummary,
        expenseByCategory,
     })

    }catch(error){
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({message: 'Error  dashboard metrics', error: errorMessage});
    }
};
