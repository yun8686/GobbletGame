using System;
using UnityEngine;
using UnityEngine.UI;

public class Canvas : MonoBehaviour
{
    public GameObject infoText;
    private Text infoTextComp;
    private Board board = Board.GetInstance();

    void Start()
    {
        infoTextComp = infoText.GetComponent<Text>();
        infoTextComp.text = "ok";
    }

    // Update is called once per frame
    void Update()
    {
        bool[] winner = board.checkWinner();
        if (winner[0] && !winner[1])
        {
            infoTextComp.text = "青の勝ち";
        } else if (!winner[0] && winner[1])
        {
            infoTextComp.text = "オレンジの勝ち";
        }
        else if(winner[0] && winner[1])
        {
            infoTextComp.text = "引き分け";
        }
    }

}
