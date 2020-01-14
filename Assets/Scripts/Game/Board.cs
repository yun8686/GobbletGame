using System;
using System.Collections.Generic;
using UnityEngine;

public class Board
{
    /*
     * ゲームの情報を管理するクラス
     */
    // シングルトン
    private static Board instance;
    private Board(){}
    public static Board GetInstance()
    {
        if(instance == null)
        {
            instance = new Board();
            instance.ResetBoard();

        }
        return instance;
    }

    private Stack<Obake>[,] board = new Stack<Obake>[BoardManager.RCNUM, BoardManager.RCNUM];
    private int nowTrunOwner = -1;

    public void ResetBoard()
    {
        nowTrunOwner = 0;
        for (int i=0;i< BoardManager.RCNUM; i++)
        {
            for (int j = 0; j < BoardManager.RCNUM; j++)
            {
                board[i, j] = new Stack<Obake>();
            }
        }
    }

    public bool canPut(int x, int y, Obake obake)
    {
        if(board[x, y].Count == 0 || board[x, y].Peek().size < obake.size)
        {
            return true;
        }
        return false;
    }

    // Stackの一番上のおばけだけ移動可能
    public bool canMove(Obake obake)
    {
        if (obake.owner != nowTrunOwner) return false;

        if (obake.nowXY[0] != -1 && obake.nowXY[1] != -1)
        {
            if(board[obake.nowXY[0], obake.nowXY[1]].Peek() != obake)
            {
                return false;
            }
        }
        return true;
    }
    public void move(int x, int y, Obake obake)
    {
        if (obake.nowXY[0] != -1 && obake.nowXY[1] != -1)
        {
            board[obake.nowXY[0], obake.nowXY[1]].Pop();
        }
        board[x, y].Push(obake);
        obake.nowXY[0] = x;
        obake.nowXY[1] = y;
        nowTrunOwner = 1 - nowTrunOwner;
    }

    // 勝利判定  [owner]=trueが勝利, 両方trueの場合は引き分け
    public bool[] checkWinner()
    {
        bool[] winner = { false, false };
        int[,] masu = new int[3, 3];
        for(int i = 0; i < BoardManager.RCNUM; i++)
        {
            for(int j = 0; j < BoardManager.RCNUM; j++)
            {
                masu[i, j] = board[i, j].Count > 0 ? board[i, j].Peek().owner : -1;
            }
        }

        // 縦横チェック(3x3以外は要実装)
        for(int i = 0; i < 3; i++)
        {
            if (masu[i, 0] != -1 && masu[i, 0] == masu[i, 1] && masu[i, 0] == masu[i, 2])
            {
                winner[masu[i, 0]] = true;
            }
            if (masu[0, i] != -1 && masu[0, i] == masu[1, i] && masu[0, i] == masu[2, i])
            {
                winner[masu[0, i]] = true;
            }
        }
        // 斜めチェック
        if(masu[1, 1] != -1)
        {
            if (masu[0, 0] == masu[1, 1] && masu[0, 0] == masu[2, 2])
            {
                winner[masu[0, 0]] = true;
            }
            if (masu[2, 0] == masu[1, 1] && masu[2, 0] == masu[0, 2])
            {
                winner[masu[2, 0]] = true;
            }
        }
        return winner;
    }
}
