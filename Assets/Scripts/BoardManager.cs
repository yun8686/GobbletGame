using UnityEngine;

public class BoardManager : MonoBehaviour
{
    private Camera camera_object;
    private RaycastHit hit;

    // Start is called before the first frame update
    void Start()
    {
        camera_object = GameObject.Find("Main Camera").GetComponent<Camera>();
        int length = gameObject.transform.childCount;
        for (int i = 0; i < length; ++i)
        {
            GameObject tile = gameObject.transform.GetChild(i).gameObject;
            if (i % 2 == 0) // 縞模様にする
            {
                tile.GetComponent<Renderer>().material.color = Color.gray;
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = camera_object.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out hit))
            {
                GameObject clickedObject = hit.collider.gameObject;
                //x,zの値を取得
                int x = (int)clickedObject.transform.position.x;
                int z = (int)clickedObject.transform.position.z;
                Debug.Log(x.ToString() + " " + z.ToString());
            }
        }else if (Input.GetMouseButtonUp(0))
        {
        }
    }
}
