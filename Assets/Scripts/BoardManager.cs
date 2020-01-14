using System.Collections.Generic;
using UnityEngine;

public class BoardManager : MonoBehaviour
{
    public const int HANDS_NUM = 6;
    public const int PLAYER_NUM = 2;
    public const int RCNUM = 3;
    Vector3[,] handsPlaces = new Vector3[PLAYER_NUM, HANDS_NUM];



    GameObject bigObakePrefab, middleObakePrefab, smallObakePrefab;
    Material[] playerMaterials = new Material[PLAYER_NUM];
    private void SetResource()
    {
        bigObakePrefab = (GameObject)Resources.Load("Prefabs/BigObake");
        middleObakePrefab = (GameObject)Resources.Load("Prefabs/MiddleObake");
        smallObakePrefab = (GameObject)Resources.Load("Prefabs/SmallObake");
        playerMaterials[0] = (Material)Resources.Load("Materials/Player1Material");
        playerMaterials[1] = (Material)Resources.Load("Materials/Player2Material");
    }
    private void SetPosition()
    {
        float[] ypos = { 0.25f, 0.25f, 0.15f, 0.15f, 0.05f, 0.05f };
        for (int i = 0; i < HANDS_NUM; i++)
        {
            handsPlaces[0, i] = new Vector3((float)(0.8 * i) - 1f, ypos[i], -1f);    // 青プレイヤーの場所
            handsPlaces[1, i] = new Vector3((float)(0.8 * (HANDS_NUM - i - 1)) -1f, ypos[i], 3f);    // オレンジプレイヤーの場所
        }
    }

    private void SetObake()
    {
        for (int i = 0; i < PLAYER_NUM; i++)
        {
            GameObject o1 = Instantiate(bigObakePrefab, handsPlaces[i, 0], Quaternion.identity) as GameObject;
            o1.GetComponent<Renderer>().material = playerMaterials[i];
            o1.GetComponent<Obake>().size = 3;
            o1.GetComponent<Obake>().id = i*HANDS_NUM + 1;
            o1.GetComponent<Obake>().owner = i;
            GameObject o2 = Instantiate(bigObakePrefab, handsPlaces[i, 1], Quaternion.identity) as GameObject;
            o2.GetComponent<Renderer>().material = playerMaterials[i];
            o2.GetComponent<Obake>().size = 3;
            o2.GetComponent<Obake>().id = i * HANDS_NUM + 2;
            o2.GetComponent<Obake>().owner = i;
            GameObject o3 = Instantiate(middleObakePrefab, handsPlaces[i, 2], Quaternion.identity) as GameObject;
            o3.GetComponent<Renderer>().material = playerMaterials[i];
            o3.GetComponent<Obake>().size = 2;
            o3.GetComponent<Obake>().id = i * HANDS_NUM + 3;
            o3.GetComponent<Obake>().owner = i;
            GameObject o4 = Instantiate(middleObakePrefab, handsPlaces[i, 3], Quaternion.identity) as GameObject;
            o4.GetComponent<Renderer>().material = playerMaterials[i];
            o4.GetComponent<Obake>().size = 2;
            o4.GetComponent<Obake>().id = i * HANDS_NUM + 4;
            o4.GetComponent<Obake>().owner = i;
            GameObject o5 = Instantiate(smallObakePrefab, handsPlaces[i, 4], Quaternion.identity) as GameObject;
            o5.GetComponent<Renderer>().material = playerMaterials[i];
            o5.GetComponent<Obake>().size = 1;
            o5.GetComponent<Obake>().id = i * HANDS_NUM + 5;
            o5.GetComponent<Obake>().owner = i;
            GameObject o6 = Instantiate(smallObakePrefab, handsPlaces[i, 5], Quaternion.identity) as GameObject;
            o6.GetComponent<Renderer>().material = playerMaterials[i];
            o6.GetComponent<Obake>().size = 1;
            o6.GetComponent<Obake>().id = i * HANDS_NUM + 6;
            o6.GetComponent<Obake>().owner = i;
        }
    }

    // Start is called before the first frame update
    void Start()
    {
        SetResource();
        SetPosition();
        SetObake();
    }

    // Update is called once per frame
    void Update()
    {
    }
}
